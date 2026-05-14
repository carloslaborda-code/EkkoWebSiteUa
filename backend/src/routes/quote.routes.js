const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const {
  getQuotes,
  getQuoteById,
  getUploadSignature,
  createQuote,
  updateQuoteAccessibility,
  deleteQuote,
  toggleSaveQuote,
  rateQuote,
  registerView,
  registerDownload
} = require('../controllers/quote.controller');

router.get('/', getQuotes);
router.get('/:id', getQuoteById);
router.post('/upload-signature', authMiddleware, getUploadSignature);
router.post('/', authMiddleware, createQuote);
router.patch('/:id/accessibility', authMiddleware, adminMiddleware, updateQuoteAccessibility);
router.delete('/:id', authMiddleware, adminMiddleware, deleteQuote);
router.post('/:id/view', registerView);
router.post('/:id/save', authMiddleware, toggleSaveQuote);
router.post('/:id/rate', authMiddleware, rateQuote);
router.post('/:id/download', authMiddleware, registerDownload);

module.exports = router;
