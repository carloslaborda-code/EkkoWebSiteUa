const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Quote = require('../src/models/quote');
const User = require('../src/models/user');
const { uploadToCloudinary, isDataUri, hasCloudinaryConfig } = require('../src/services/cloudinary.service');

const isDryRun = process.argv.includes('--dry-run');

const rebuildUserUploads = async () => {
  const users = await User.find().select('_id uploads uploadsCount');

  for (const user of users) {
    const createdQuotes = await Quote.find({ createdBy: user._id })
      .sort({ createdAt: -1 })
      .select('workTitle image mediaType')
      .lean();

    const uploads = createdQuotes.map((quote) => ({
      title: quote.workTitle || '',
      image: quote.image || '',
      type: quote.mediaType === 'video' ? 'video' : 'audio'
    }));

    user.uploads = uploads;
    user.uploadsCount = uploads.length;

    if (!isDryRun) {
      await user.save();
    }
  }
};

const migrateQuote = async (quote) => {
  let changed = false;

  if (isDataUri(quote.image)) {
    quote.image = await uploadToCloudinary(quote.image, {
      folder: 'ekko/covers',
      resourceType: 'image'
    });
    changed = true;
  }

  if (isDataUri(quote.mediaUrl)) {
    quote.mediaUrl = await uploadToCloudinary(quote.mediaUrl, {
      folder: quote.mediaType === 'audio' ? 'ekko/audio' : 'ekko/video',
      resourceType: 'video'
    });
    changed = true;
  }

  if (changed && !isDryRun) {
    await quote.save();
  }

  return changed;
};

const run = async () => {
  if (!hasCloudinaryConfig()) {
    throw new Error('Faltan variables de Cloudinary en .env. Define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.');
  }

  await connectDB();

  const quotes = await Quote.find({
    $or: [{ image: /^data:/ }, { mediaUrl: /^data:/ }]
  });

  if (!quotes.length) {
    console.log('No hay publicaciones antiguas en data URI para migrar.');
    await mongoose.disconnect();
    return;
  }

  console.log(`${isDryRun ? '[DRY RUN] ' : ''}Se han encontrado ${quotes.length} publicaciones para revisar.`);

  let migratedCount = 0;

  for (const quote of quotes) {
    console.log(`Procesando: ${quote.workTitle} (${quote._id})`);
    const changed = await migrateQuote(quote);

    if (changed) {
      migratedCount += 1;
      console.log(`  ${isDryRun ? 'Se migraria' : 'Migrada'} correctamente.`);
    } else {
      console.log('  No necesitaba cambios.');
    }
  }

  console.log(`${isDryRun ? '[DRY RUN] ' : ''}Publicaciones migradas: ${migratedCount}`);

  if (migratedCount > 0) {
    await rebuildUserUploads();
    console.log(`${isDryRun ? '[DRY RUN] ' : ''}Uploads de usuario resincronizados.`);
  }

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Error durante la migracion:', error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
