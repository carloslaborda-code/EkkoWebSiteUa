const express = require('express');
const router = express.Router();
const {
  getQuotes,
  getQuoteById,
  createQuote
} = require('../controllers/quote.controller');

router.get('/', getQuotes);
router.get('/:id', getQuoteById);
router.post('/', createQuote);

module.exports = router;