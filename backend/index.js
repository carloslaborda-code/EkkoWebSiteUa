// 'use strict';

// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');

// const connectDB = require('./db');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Config
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// // Ruta test
// app.get("/", (req, res) => {
//   res.json({ message: "API running 🚀" });
// });

// // 🔥 Inicialización ordenada
// const startServer = async () => {
//   await connectDB(MONGO_URI);

//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// };

// startServer();

// module.exports = app;

'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Ruta test
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// 🔥 Endpoint de test para insertar un documento en la BD
app.get("/test-db", async (req, res) => {
  try {
    const TestSchema = new mongoose.Schema({ name: String });
    const Test = mongoose.model('Test', TestSchema);

    const doc = await Test.create({ name: "Funciona 🚀" });

    res.json({ success: true, doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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