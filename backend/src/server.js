require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { ensureDefaultAdminUser } = require('./services/admin-user.service');

const PORT = process.env.PORT || 5000;

const validateProductionConfig = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const requiredKeys = [
    'MONGO_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  if (missingKeys.length) {
    throw new Error(`Faltan variables de entorno en produccion: ${missingKeys.join(', ')}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres en produccion.');
  }
};

const startServer = async () => {
  validateProductionConfig();
  await connectDB();
  await ensureDefaultAdminUser();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error.message);
  process.exit(1);
});
