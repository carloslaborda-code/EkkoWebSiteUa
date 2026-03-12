const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware CORS global (ya lo tienes)
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});