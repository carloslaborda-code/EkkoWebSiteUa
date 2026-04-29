const crypto = require('crypto');

let hasWarnedMissingConfig = false;

const isDataUri = (value) => typeof value === 'string' && value.startsWith('data:');

const getCloudinaryConfig = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || ''
});

const hasCloudinaryConfig = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return !!cloudName && !!apiKey && !!apiSecret;
};

const buildSignature = (params, apiSecret) => {
  const signatureBase = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(`${signatureBase}${apiSecret}`)
    .digest('hex');
};

const uploadToCloudinary = async (file, { folder, resourceType }) => {
  if (!isDataUri(file)) {
    return file;
  }

  if (!hasCloudinaryConfig()) {
    if (!hasWarnedMissingConfig) {
      hasWarnedMissingConfig = true;
      console.warn('Cloudinary no esta configurado. Se conservaran los data URI en MongoDB hasta definir CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.');
    }

    return file;
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildSignature({ folder, timestamp }, apiSecret);
  const formData = new FormData();

  formData.append('file', file);
  formData.append('folder', folder);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', apiKey);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`No se pudo subir el archivo a Cloudinary: ${errorText}`);
  }

  const payload = await response.json();
  return payload.secure_url || payload.url || file;
};

module.exports = {
  uploadToCloudinary,
  isDataUri,
  hasCloudinaryConfig
};
