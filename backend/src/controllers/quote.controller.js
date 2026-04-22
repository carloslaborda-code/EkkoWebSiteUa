const Quote = require('../models/quote');
const seedQuotes = require('../data/seedQuotes');
const User = require('../models/user');

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

  return changed ? quote.save() : Promise.resolve(quote);
};

const getQuotes = async (req, res) => {
  try {
    await ensureSeedQuotes();
    const quotes = await Quote.find().sort({ createdAt: -1 });
    await Promise.all(quotes.map((quote) => ensureQuoteDefaults(quote)));
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener quotes', error: error.message });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ message: 'Quote no encontrada' });
    }

    await ensureQuoteDefaults(quote);

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la quote', error: error.message });
  }
};

const createQuote = async (req, res) => {
  try {
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

    if (!text || !workTitle || !year) {
      return res.status(400).json({ message: 'text, workTitle y year son obligatorios' });
    }

    const newQuote = await Quote.create({
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
    });

    res.status(201).json({
      message: 'Quote creada correctamente',
      quote: newQuote
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la quote', error: error.message });
  }
};

const toggleSaveQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ message: 'Publicacion no encontrada' });
    }

    const user = await User.findById(req.user._id);
    const alreadySaved = user.savedQuotes.some((savedId) => savedId.toString() === quote._id.toString());

    if (alreadySaved) {
      user.savedQuotes = user.savedQuotes.filter((savedId) => savedId.toString() !== quote._id.toString());
    } else {
      user.savedQuotes.push(quote._id);
    }

    await user.save();

    res.json({
      message: alreadySaved ? 'Contenido eliminado de guardados' : 'Contenido guardado correctamente',
      saved: !alreadySaved
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la publicacion', error: error.message });
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
  registerDownload
};
