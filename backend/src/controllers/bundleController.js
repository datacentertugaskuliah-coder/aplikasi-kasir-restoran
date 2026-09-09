// Controller CRUD paket/bundling menu — kombinasi beberapa item dengan harga khusus
const Bundle = require('../models/Bundle');

async function listBundles(req, res) {
  const bundles = await Bundle.findAll();
  return res.json({ bundles });
}

async function createBundle(req, res) {
  const { name, description, bundlePrice, items } = req.body;
  if (!name || bundlePrice === undefined || !items || items.length === 0) {
    return res.status(400).json({ error: 'Nama, harga paket, dan minimal 1 item wajib diisi' });
  }
  try {
    const bundle = await Bundle.create({ name, description, bundlePrice, items });
    return res.status(201).json({ bundle });
  } catch (err) {
    console.error('Create bundle error:', err);
    return res.status(500).json({ error: 'Gagal membuat paket' });
  }
}

async function deactivateBundle(req, res) {
  const { id } = req.params;
  const bundle = await Bundle.setActive(id, false);
  if (!bundle) return res.status(404).json({ error: 'Paket tidak ditemukan' });
  return res.json({ message: 'Paket dinonaktifkan', bundle });
}

module.exports = { listBundles, createBundle, deactivateBundle };
