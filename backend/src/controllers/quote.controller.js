const Quote = require('../models/quote');
const seedQuotes = require('../data/seedQuotes');
const User = require('../models/user');

const normalizeSavedQuotes = (savedQuotes = []) => {
  const seenIds = new Set();

  return savedQuotes.filter((savedQuote) => {
    const id = savedQuote?.toString();

    if (!id || seenIds.has(id)) {
      return false;
    }

    seenIds.add(id);
    return true;
  });
};

const normalizeRatedQuotes = (ratedQuotes = []) => {
  const latestRatings = new Map();

  ratedQuotes.forEach((ratedQuote) => {
    const quoteId = ratedQuote?.quoteId?.toString?.();
    const value = Number(ratedQuote?.value);

    if (!quoteId || !Number.isFinite(value) || value < 1 || value > 5) {
      return;
    }

    latestRatings.set(quoteId, { quoteId: ratedQuote.quoteId, value });
  });

  return Array.from(latestRatings.values());
};

const parseCount = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const normalized = String(value || '0').trim().toUpperCase().replace(',', '.');
  const multiplier = normalized.endsWith('M') ? 1_000_000 : normalized.endsWith('K') ? 1_000 : 1;
  const numericPart = multiplier === 1 ? normalized : normalized.slice(0, -1);
  const parsed = Number.parseFloat(numericPart);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.round(parsed * multiplier);
};

const formatCount = (value) => {
  if (value >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1);
    return `${formatted.replace('.0', '')}M`;
  }

  if (value >= 1_000) {
    const formatted = (value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1);
    return `${formatted.replace('.0', '')}K`;
  }

  return String(value);
};

const ensureSeedQuotes = async () => {
  const totalQuotes = await Quote.countDocuments();

  if (!totalQuotes) {
    await Quote.insertMany(seedQuotes);
  }
};

const ensureQuoteDefaults = (quote) => {
  let changed = false;

  if (!quote.mediaType) {
    quote.mediaType = quote.image ? 'video' : 'audio';
    changed = true;
  }

  if (!quote.mediaUrl) {
    quote.mediaUrl = '/assets/media/scarfacevideo.mp4';
    changed = true;
  }

  if (!quote.duration) {
    quote.duration = '00:00';
    changed = true;
  }

  if (!quote.actorName) {
    quote.actorName = '';
    changed = true;
  }

  if (!quote.characterName) {
    quote.characterName = '';
    changed = true;
  }

  if (!quote.synopsis) {
    quote.synopsis = '';
    changed = true;
  }

  if (!Array.isArray(quote.hashtags)) {
    quote.hashtags = [];
    changed = true;
  }

  if (typeof quote.ratingsCount !== 'number') {
    quote.ratingsCount = 0;
    changed = true;
  }

  return changed ? quote.save() : Promise.resolve(quote);
};

const getQuotes = async (req, res) => {
  try {
    await ensureSeedQuotes();
    const quotes = await Quote.find().sort({ createdAt: -1 });
    await Promise.all(quotes.map((quote) => ensureQuoteDefaults(quote)));
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las publicaciones', error: error.message });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    await ensureQuoteDefaults(quote);

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la publicación', error: error.message });
  }
};

const createQuote = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const {
      text,
      workTitle,
      year,
      rating,
      views,
      image,
      mediaType,
      mediaUrl,
      duration,
      actorName,
      characterName,
      synopsis,
      hashtags,
      category
    } = req.body;

    if (!text || !workTitle || !year || !actorName || !characterName || !synopsis || !mediaType || !mediaUrl || !category) {
      return res.status(400).json({
        message: 'text, workTitle, year, actorName, characterName, synopsis, mediaType, mediaUrl y category son obligatorios'
      });
    }

    const normalizedHashtags = Array.isArray(hashtags)
      ? hashtags.filter(Boolean)
      : String(hashtags || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);

    const newQuote = await Quote.create({
      text: String(text).trim(),
      workTitle: String(workTitle).trim(),
      year: Number(year),
      rating: typeof rating === 'number' ? rating : 0,
      views: typeof views === 'string' && views.trim() ? views.trim() : '0',
      image: typeof image === 'string' ? image : '',
      mediaType,
      mediaUrl,
      duration: typeof duration === 'string' && duration.trim() ? duration.trim() : '00:00',
      actorName: String(actorName).trim(),
      characterName: String(characterName).trim(),
      synopsis: String(synopsis).trim(),
      hashtags: normalizedHashtags,
      category,
      createdBy: user._id
    });

    const uploadType = mediaType === 'video' ? 'video' : 'audio';

    user.uploads.push({
      title: newQuote.workTitle,
      image: newQuote.image,
      type: uploadType
    });
    user.uploadsCount = user.uploads.length;
    await user.save();

    res.status(201).json({
      message: 'Publicación creada correctamente',
      quote: newQuote,
      user: {
        uploadsCount: user.uploadsCount,
        uploads: user.uploads
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la publicación', error: error.message });
  }
};

const toggleSaveQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ message: 'Publicacion no encontrada' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const normalizedSavedQuotes = normalizeSavedQuotes(user.savedQuotes);
    if (normalizedSavedQuotes.length !== user.savedQuotes.length) {
      user.savedQuotes = normalizedSavedQuotes;
    }

    const quoteId = quote._id.toString();
    const alreadySaved = user.savedQuotes.some((savedId) => savedId.toString() === quoteId);

    if (alreadySaved) {
      user.savedQuotes = user.savedQuotes.filter((savedId) => savedId.toString() !== quoteId);
    } else {
      user.savedQuotes.push(quote._id);
    }

    await user.save();

    res.json({
      message: alreadySaved ? 'Contenido eliminado de guardados' : 'Contenido guardado correctamente',
      saved: !alreadySaved,
      savedCount: user.savedQuotes.length,
      savedQuoteIds: user.savedQuotes.map((savedId) => savedId.toString())
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la publicacion', error: error.message });
  }
};

const rateQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ message: 'Publicacion no encontrada' });
    }

    const user = await User.findById(req.user._id);
    const ratingValue = Number(req.body?.value);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: 'La valoracion debe ser un numero entre 1 y 5' });
    }

    const normalizedRatedQuotes = normalizeRatedQuotes(user.ratedQuotes);
    if (normalizedRatedQuotes.length !== user.ratedQuotes.length) {
      user.ratedQuotes = normalizedRatedQuotes;
    }

    const quoteId = quote._id.toString();
    const existingRating = user.ratedQuotes.find((ratedQuote) => ratedQuote.quoteId.toString() === quoteId);
    const currentRatingsCount = typeof quote.ratingsCount === 'number' ? quote.ratingsCount : 0;
    const currentTotalRating = (quote.rating || 0) * currentRatingsCount;

    if (existingRating) {
      const updatedTotalRating = currentTotalRating - existingRating.value + ratingValue;
      existingRating.value = ratingValue;
      quote.rating = Number((updatedTotalRating / currentRatingsCount).toFixed(1));
    } else {
      user.ratedQuotes.push({
        quoteId: quote._id,
        value: ratingValue
      });
      quote.ratingsCount = currentRatingsCount + 1;
      const updatedTotalRating = currentTotalRating + ratingValue;
      quote.rating = Number((updatedTotalRating / quote.ratingsCount).toFixed(1));
    }

    await Promise.all([user.save(), quote.save()]);

    res.json({
      message: 'Valoracion registrada correctamente',
      rating: quote.rating,
      ratingsCount: quote.ratingsCount,
      ratedQuotes: user.ratedQuotes.map((ratedQuote) => ({
        quoteId: ratedQuote.quoteId.toString(),
        value: ratedQuote.value
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la valoracion', error: error.message });
  }
};

const registerView = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ message: 'Publicacion no encontrada' });
    }

    const currentViews = parseCount(quote.views);
    quote.views = formatCount(currentViews + 1);
    await quote.save();

    res.json({
      message: 'Visualizacion registrada correctamente',
      views: quote.views
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la visualizacion', error: error.message });
  }
};

const registerDownload = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!quote || !user) {
      return res.status(404).json({ message: 'No se encontro el contenido o el usuario' });
    }

    user.downloads += 1;
    await user.save();

    res.json({
      message: 'Descarga registrada correctamente',
      mediaUrl: quote.mediaUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la descarga', error: error.message });
  }
};

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  toggleSaveQuote,
  rateQuote,
  registerDownload,
  registerView
};
