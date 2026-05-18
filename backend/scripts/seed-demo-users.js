require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../src/models/user');

const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || 'EkkoDemo123!';

const demoUsers = [
  {
    username: 'Sergio Pernas',
    email: 'sergio.pernas@ekko.demo'
  },
  {
    username: 'Carlos Laborda',
    email: 'carlos.laborda@ekko.demo'
  },
  {
    username: 'Ionathan Hudrea',
    email: 'ionathan.hudrea@ekko.demo'
  }
];

const seedDemoUsers = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Define MONGO_URI antes de ejecutar el script de usuarios demo.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const password = await bcrypt.hash(DEMO_PASSWORD, 10);

    for (const demoUser of demoUsers) {
      await User.updateOne(
        { email: demoUser.email },
        {
          $set: {
            username: demoUser.username,
            email: demoUser.email,
            password,
            role: 'user'
          }
        },
        { upsert: true }
      );
    }

    console.log(`Usuarios demo preparados: ${demoUsers.map((user) => user.email).join(', ')}`);
    console.log(`Contrasena demo: ${DEMO_PASSWORD}`);
  } finally {
    await mongoose.disconnect();
  }
};

seedDemoUsers().catch((error) => {
  console.error('No se pudieron preparar los usuarios demo:', error.message);
  process.exit(1);
});
