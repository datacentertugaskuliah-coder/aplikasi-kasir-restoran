// Entry point untuk Vercel Serverless Functions.
// Vercel akan otomatis mengarahkan semua request ke /api/* ke file ini,
// yang membungkus Express app yang sama dipakai untuk hosting biasa (src/server.js).
const app = require('../src/server');

module.exports = app;
