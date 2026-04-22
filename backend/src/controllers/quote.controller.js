const Quote = require('../models/quote');
const seedQuotes = require('../data/seedQuotes');

const ensureSeedQuotes = async () => {
  const totalQuotes = await Quote.countDocuments();

  if (!totalQuotes) {
    await Quote.insertMany(seedQuotes);
  }
};

const getQuotes = async (req, res) => {
  try {
    await ensureSeedQuotes();
    const quotes = await Quote.find().sort({ createdAt: -1 });
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

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la quote', error: error.message });
  }
};

const createQuote = async (req, res) => {
  try {
    const { text, workTitle, year, rating, views, image, category } = req.body;

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

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote
};
