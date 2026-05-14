const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');

const BLOCKED_ADMIN_VALUES = {
  email: 'admin@ekko.local',
  password: 'Admin1234!'
};

const isProduction = () => process.env.NODE_ENV === 'production';

const isEnabled = (value) => ['1', 'true', 'yes', 'on'].includes(String(value || '').toLowerCase());

const shouldEnsureAdmin = () => {
  if (process.env.DISABLE_DEFAULT_ADMIN === 'true') {
    return false;
  }

  if (isProduction()) {
    return isEnabled(process.env.ADMIN_SEED_ENABLED);
  }

  const hasLocalAdminConfig = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);

  return hasLocalAdminConfig && (process.env.ADMIN_SEED_ENABLED === undefined || isEnabled(process.env.ADMIN_SEED_ENABLED));
};

const getAdminConfig = () => ({
  username: (process.env.ADMIN_USERNAME || 'admin').trim(),
  email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD || ''
});

const isStrongProductionPassword = (password = '') =>
  password.length >= 16 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const validateAdminConfig = ({ email, password }) => {
  if (!email || !password) {
    if (isProduction()) {
      throw new Error('ADMIN_SEED_ENABLED esta activo, pero faltan ADMIN_EMAIL o ADMIN_PASSWORD.');
    }

    return false;
  }

  if (!isProduction()) {
    return true;
  }

  if (email === BLOCKED_ADMIN_VALUES.email || password === BLOCKED_ADMIN_VALUES.password) {
    throw new Error('No uses credenciales locales de admin en produccion.');
  }

  if (!isStrongProductionPassword(password)) {
    throw new Error('ADMIN_PASSWORD debe tener al menos 16 caracteres, mayusculas, minusculas, numeros y simbolos.');
  }

  return true;
};

const applyAdminCredentials = async (user, { username, email, password }) => {
  let changed = false;
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (user.role !== 'admin') {
    user.role = 'admin';
    changed = true;
  }

  if (username && user.username !== username) {
    user.username = username;
    changed = true;
  }

  if (user.email !== email) {
    user.email = email;
    changed = true;
  }

  if (!passwordMatches) {
    user.password = await bcrypt.hash(password, 10);
    changed = true;
  }

  if (changed) {
    await user.save();
  }
};

const neutralizeLegacyAdmin = async (legacyAdmin) => {
  if (!legacyAdmin) {
    return;
  }

  legacyAdmin.role = 'user';
  legacyAdmin.password = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
  await legacyAdmin.save();
};

const ensureDefaultAdminUser = async () => {
  if (!shouldEnsureAdmin()) {
    return;
  }

  const adminConfig = getAdminConfig();
  const { username, email, password } = adminConfig;

  if (!validateAdminConfig({ email, password })) {
    return;
  }

  const existingAdmin = await User.findOne({ email });
  const legacyAdmin = email === BLOCKED_ADMIN_VALUES.email
    ? null
    : await User.findOne({ email: BLOCKED_ADMIN_VALUES.email });

  if (existingAdmin) {
    await applyAdminCredentials(existingAdmin, adminConfig);
    await neutralizeLegacyAdmin(legacyAdmin);
    return;
  }

  if (legacyAdmin) {
    await applyAdminCredentials(legacyAdmin, adminConfig);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword,
    role: 'admin'
  });
};

module.exports = {
  ensureDefaultAdminUser
};
