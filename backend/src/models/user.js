const mongoose = require('mongoose');
const { defaultUserSettings, defaultUploads } = require('../data/defaultUserData');

const uploadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'audio'
    }
  },
  { _id: false }
);

const ratedQuoteSchema = new mongoose.Schema(
  {
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    colorFilter: {
      type: String,
      default: defaultUserSettings.colorFilter
    },
    highContrast: {
      type: Boolean,
      default: defaultUserSettings.highContrast
    },
    textSize: {
      type: String,
      default: defaultUserSettings.textSize
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    },
    downloads: {
      type: Number,
      default: 0
    },
    uploadsCount: {
      type: Number,
      default: 0
    },
    uploads: {
      type: [uploadSchema],
      default: defaultUploads
    },
    savedQuotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
      }
    ],
    ratedQuotes: {
      type: [ratedQuoteSchema],
      default: []
    },
    settings: {
      type: settingsSchema,
      default: defaultUserSettings
    },
    role: {
      type: String,
      default: 'user'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
