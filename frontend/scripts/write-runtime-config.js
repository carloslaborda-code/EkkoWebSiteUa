const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const outputPath = path.join(assetsDir, 'runtime-config.js');
const apiBaseUrl = (process.env.EKKO_API_BASE_URL || process.env.NG_APP_API_BASE_URL || '').trim().replace(/\/+$/, '');

fs.mkdirSync(assetsDir, { recursive: true });
fs.writeFileSync(
  outputPath,
  `window.__EKKO_CONFIG__ = Object.assign({}, window.__EKKO_CONFIG__, { apiBaseUrl: ${JSON.stringify(apiBaseUrl)} });\n`
);
