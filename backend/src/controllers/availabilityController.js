// Controller khusus toggle ketersediaan (habis/tersedia) — bisa diakses Kasir & Pelayan,
// terpisah dari CRUD penuh yang dibatasi Owner (lihat menuItemController & bundleController)
const MenuItem = require('../models/MenuItem');
const Bundle = require('../models/Bundle');

async function toggleMenuItemAvailability(req, res) {
  const { id } = req.params;
  const { isAvailable } = req.body;
  if (typeof isAvailable !== 'boolean') {
    return res.status(400).json({ error: 'isAvailable harus berupa boolean' });
  }
  const item = await MenuItem.setAvailable(id, isAvailable);
  if (!item) return res.status(404).json({ error: 'Menu tidak ditemukan' });
  return res.json({ item });
}

async function toggleBundleAvailability(req, res) {
  const { id } = req.params;
  const { isAvailable } = req.body;
  if (typeof isAvailable !== 'boolean') {
    return res.status(400).json({ error: 'isAvailable harus berupa boolean' });
  }
  const bundle = await Bundle.setAvailable(id, isAvailable);
  if (!bundle) return res.status(404).json({ error: 'Paket tidak ditemukan' });
  return res.json({ bundle });
}

module.exports = { toggleMenuItemAvailability, toggleBundleAvailability };
