const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    workTitle: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    views: {
      type: String,
      default: '0'
    },
    image: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'movie'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);
