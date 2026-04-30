const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const quoteRoutes = require('./routes/quote.routes');

const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);

module.exports = app;
