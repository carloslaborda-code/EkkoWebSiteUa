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
    mediaType: {
      type: String,
      enum: ['video', 'audio'],
      default: 'video'
    },
    mediaUrl: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: '00:00'
    },
    actorName: {
      type: String,
      default: ''
    },
    characterName: {
      type: String,
      default: ''
    },
    synopsis: {
      type: String,
      default: ''
    },
    hashtags: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      default: 'movie'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);
