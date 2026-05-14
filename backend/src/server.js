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
    'JWT_SECRET'
  ];
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  if (missingKeys.length) {
    throw new Error(`Faltan variables de entorno en produccion: ${missingKeys.join(', ')}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.warn('JWT_SECRET deberia tener al menos 32 caracteres en produccion.');
  }
};

const startServer = async () => {
  validateProductionConfig();
  await connectDB();

  try {
    await ensureDefaultAdminUser();
  } catch (error) {
    console.error('No se pudo preparar el usuario admin:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error.message);
  process.exit(1);
});
