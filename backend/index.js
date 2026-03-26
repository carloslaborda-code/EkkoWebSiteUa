'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Ruta test principal
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// 🔥 Inicialización ordenada
const startServer = async () => {
  await connectDB(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;