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
      default: 45
    },
    uploadsCount: {
      type: Number,
      default: 12
    },
    uploads: {
      type: [uploadSchema],
      default: defaultUploads
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
