const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Quote = require('../models/quote');
const { defaultUploads, defaultUserSettings } = require('../data/defaultUserData');

const hasLegacyMockUploads = (uploads = []) => {
  const legacyTitles = ['Techno Echo 01', 'Vocal Snippet B', 'Mix Master Loop', 'Techno Echo 01'];

  return (
    Array.isArray(uploads) &&
    uploads.length === legacyTitles.length &&
    uploads.every((upload, index) => upload?.title === legacyTitles[index])
  );
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
    if (!user.settings.colorFilter) {
      user.settings.colorFilter = defaultUserSettings.colorFilter;
      changed = true;
    }

    if (typeof user.settings.highContrast !== 'boolean') {
      user.settings.highContrast = defaultUserSettings.highContrast;
      changed = true;
    }

    if (!user.settings.textSize) {
      user.settings.textSize = defaultUserSettings.textSize;
      changed = true;
    }
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

  return user;
};

const syncUploadsFromQuotes = async (user) => {
  const createdQuotes = await Quote.find({ createdBy: user._id })
    .sort({ createdAt: -1 })
    .select('workTitle image mediaType');

  const uploadsFromQuotes = createdQuotes.map((quote) => ({
    title: quote.workTitle,
    image: quote.image || '',
    type: quote.mediaType === 'video' ? 'video' : 'audio'
  }));

  const currentUploads = Array.isArray(user.uploads) ? user.uploads.map((upload) => ({
    title: upload.title,
    image: upload.image || '',
    type: upload.type || 'audio'
  })) : [];

  const hasChanged =
    JSON.stringify(currentUploads) !== JSON.stringify(uploadsFromQuotes) ||
    user.uploadsCount !== uploadsFromQuotes.length;

  if (hasChanged) {
    user.uploads = uploadsFromQuotes;
    user.uploadsCount = uploadsFromQuotes.length;
    await user.save();
  }

  return user;
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
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
      return res.status(400).json({ message: 'Email o usuario y contrasena obligatorios' });
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

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('savedQuotes');
    await ensureUserDefaults(user);
    await syncUploadsFromQuotes(user);
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

    res.json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        downloads: user.downloads,
        uploadsCount: user.uploadsCount,
        uploads: user.uploads,
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
    const { colorFilter, highContrast, textSize } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await ensureUserDefaults(user);

    user.settings = {
      ...user.settings.toObject(),
      ...(typeof colorFilter === 'string' ? { colorFilter } : {}),
      ...(typeof highContrast === 'boolean' ? { highContrast } : {}),
      ...(typeof textSize === 'string' ? { textSize } : {})
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

module.exports = { register, login, getCurrentUser, updateProfile, updateSettings };
