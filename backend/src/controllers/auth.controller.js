const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Quote = require('../models/quote');
const { defaultUploads, defaultUserSettings } = require('../data/defaultUserData');
const allowedColorFilters = ['default', 'warm', 'cool', 'grayscale'];
const allowedTextSizes = ['small', 'medium', 'large', 'extra-large'];

const escapeRegExp = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasLegacyMockUploads = (uploads = []) => {
  const legacyTitles = ['Techno Echo 01', 'Vocal Snippet B', 'Mix Master Loop', 'Techno Echo 01'];

  return (
    Array.isArray(uploads) &&
    uploads.length === legacyTitles.length &&
    uploads.every((upload, index) => upload?.title === legacyTitles[index])
  );
};

const buildUploadFromQuote = (quote) => ({
  quoteId: quote._id,
  title: quote.workTitle || '',
  image: quote.image || '',
  type: quote.mediaType === 'video' ? 'video' : 'audio'
});

const uploadsAreSynced = (currentUploads = [], nextUploads = []) => {
  if (!Array.isArray(currentUploads) || currentUploads.length !== nextUploads.length) {
    return false;
  }

  return nextUploads.every((nextUpload, index) => {
    const currentUpload = currentUploads[index];

    return (
      currentUpload?.quoteId?.toString?.() === nextUpload.quoteId?.toString?.() &&
      currentUpload?.title === nextUpload.title &&
      (currentUpload?.image || '') === nextUpload.image &&
      currentUpload?.type === nextUpload.type
    );
  });
};

const syncUserUploadsWithCreatedQuotes = async (user) => {
  const createdQuotes = await Quote.find({ createdBy: user._id })
    .sort({ createdAt: -1 })
    .select('_id workTitle image mediaType')
    .lean();

  if (!createdQuotes.length) {
    return;
  }

  const syncedUploads = createdQuotes.map(buildUploadFromQuote);

  if (uploadsAreSynced(user.uploads, syncedUploads) && user.uploadsCount === syncedUploads.length) {
    return;
  }

  user.uploads = syncedUploads;
  user.uploadsCount = syncedUploads.length;
  await user.save();
};

const ensureUserDefaults = async (user) => {
  let changed = false;

  if (!Array.isArray(user.uploads)) {
    user.uploads = defaultUploads;
    changed = true;
  }

  if (hasLegacyMockUploads(user.uploads) || user.uploadsCount === 12) {
    user.uploads = [];
    user.uploadsCount = 0;
    changed = true;
  }

  const actualUploadsCount = Array.isArray(user.uploads) ? user.uploads.length : 0;
  if (user.uploadsCount !== actualUploadsCount) {
    user.uploadsCount = actualUploadsCount;
    changed = true;
  }

  if (typeof user.downloads !== 'number') {
    user.downloads = 0;
    changed = true;
  } else if (user.downloads === 45) {
    user.downloads = 0;
    changed = true;
  } else if (user.downloads > 45) {
    user.downloads -= 45;
    changed = true;
  }

  if (!user.settings) {
    user.settings = defaultUserSettings;
    changed = true;
  } else {
    if (!allowedColorFilters.includes(user.settings.colorFilter)) {
      user.settings.colorFilter = defaultUserSettings.colorFilter;
      changed = true;
    }

    if (typeof user.settings.highContrast !== 'boolean') {
      user.settings.highContrast = defaultUserSettings.highContrast;
      changed = true;
    }

    if (!allowedTextSizes.includes(user.settings.textSize)) {
      user.settings.textSize = defaultUserSettings.textSize;
      changed = true;
    }

    [
      'reducedMotion',
      'largeTargets',
      'underlineLinks',
      'readableFont'
    ].forEach((settingKey) => {
      if (typeof user.settings[settingKey] !== 'boolean') {
        user.settings[settingKey] = defaultUserSettings[settingKey];
        changed = true;
      }
    });
  }

  if (!Array.isArray(user.savedQuotes)) {
    user.savedQuotes = [];
    changed = true;
  }

  if (!Array.isArray(user.ratedQuotes)) {
    user.ratedQuotes = [];
    changed = true;
  }

  if (changed) {
    await user.save();
  }

  await syncUserUploadsWithCreatedQuotes(user);

  return user;
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existingEmail = await User.findOne({ email: normalizedEmail });

    if (existingEmail) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const existingUsername = await User.findOne({
      username: { $regex: `^${escapeRegExp(normalizedUsername)}$`, $options: 'i' }
    });

    if (existingUsername) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      settings: defaultUserSettings
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const identifier = email?.trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Correo o usuario y contraseña obligatorios' });
    }

    const normalizedEmail = identifier.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: identifier }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    await ensureUserDefaults(user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login correcto',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        downloads: user.downloads,
        uploadsCount: user.uploadsCount,
        ratedQuotes: user.ratedQuotes.map((ratedQuote) => ({
          quoteId: ratedQuote.quoteId.toString(),
          value: ratedQuote.value
        })),
        settings: user.settings,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

const checkUsername = async (req, res) => {
  try {
    const username = req.query.username?.trim();

    if (!username) {
      return res.status(400).json({
        available: false,
        message: 'El nombre de usuario es obligatorio'
      });
    }

    const existingUser = await User.findOne({
      username: { $regex: `^${escapeRegExp(username)}$`, $options: 'i' }
    });

    res.json({
      available: !existingUser
    });
  } catch (error) {
    res.status(500).json({
      available: false,
      message: 'Error al comprobar el nombre de usuario',
      error: error.message
    });
  }
};

const checkEmail = async (req, res) => {
  try {
    const email = req.query.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        available: false,
        message: 'El correo electrónico es obligatorio'
      });
    }

    const existingUser = await User.findOne({ email });

    res.json({
      available: !existingUser
    });
  } catch (error) {
    res.status(500).json({
      available: false,
      message: 'Error al comprobar el correo electrónico',
      error: error.message
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'savedQuotes',
        select: 'text workTitle year rating ratingsCount views image mediaType duration actorName characterName accessibilityText hashtags category'
      });
    await ensureUserDefaults(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await ensureUserDefaults(user);

    if (username?.trim()) {
      user.username = username.trim();
    }

    if (typeof avatar === 'string') {
      user.avatar = avatar.trim();
    }

    await user.save();
    await user.populate({
      path: 'savedQuotes',
      select: 'text workTitle year rating ratingsCount views image mediaType duration actorName characterName accessibilityText hashtags category'
    });

    res.json({
      message: 'Perfil actualizado correctamente',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        downloads: user.downloads,
        uploadsCount: user.uploadsCount,
        uploads: user.uploads,
        savedQuotes: user.savedQuotes,
        ratedQuotes: user.ratedQuotes.map((ratedQuote) => ({
          quoteId: ratedQuote.quoteId.toString(),
          value: ratedQuote.value
        })),
        settings: user.settings,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      colorFilter,
      highContrast,
      textSize,
      reducedMotion,
      largeTargets,
      underlineLinks,
      readableFont
    } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await ensureUserDefaults(user);

    user.settings = {
      ...user.settings.toObject(),
      ...(typeof colorFilter === 'string' && allowedColorFilters.includes(colorFilter) ? { colorFilter } : {}),
      ...(typeof highContrast === 'boolean' ? { highContrast } : {}),
      ...(typeof textSize === 'string' && allowedTextSizes.includes(textSize) ? { textSize } : {}),
      ...(typeof reducedMotion === 'boolean' ? { reducedMotion } : {}),
      ...(typeof largeTargets === 'boolean' ? { largeTargets } : {}),
      ...(typeof underlineLinks === 'boolean' ? { underlineLinks } : {}),
      ...(typeof readableFont === 'boolean' ? { readableFont } : {})
    };

    await user.save();

    res.json({
      message: 'Ajustes actualizados correctamente',
      settings: user.settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar ajustes', error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'La contrasena actual y la nueva son obligatorias' });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'La nueva contrasena debe tener al menos 6 caracteres' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const currentPasswordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!currentPasswordMatches) {
      return res.status(401).json({ message: 'La contrasena actual no es correcta' });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({ message: 'La nueva contrasena debe ser diferente a la actual' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Contrasena actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contrasena', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  updateSettings,
  updatePassword,
  checkUsername,
  checkEmail
};
