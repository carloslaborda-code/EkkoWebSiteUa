const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  getQuotes,
  getQuoteById,
  createQuote,
  toggleSaveQuote,
  registerDownload
} = require('../controllers/quote.controller');

router.get('/', getQuotes);
router.get('/:id', getQuoteById);
router.post('/', createQuote);
router.post('/:id/save', authMiddleware, toggleSaveQuote);
router.post('/:id/download', authMiddleware, registerDownload);

module.exports = router;
