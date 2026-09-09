// Controller CRUD item menu — CRUD dibatasi Owner, listing bisa diakses semua role login
const MenuItem = require('../models/MenuItem');

async function listMenuItems(req, res) {
  const items = await MenuItem.findAll();
  return res.json({ items });
}

async function createMenuItem(req, res) {
  const { categoryId, name, description, price, photoUrl } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Nama dan harga wajib diisi' });
  }
  const item = await MenuItem.create({ categoryId, name, description, price, photoUrl });
  return res.status(201).json({ item });
}

async function updateMenuItem(req, res) {
  const { id } = req.params;
  const { categoryId, name, description, price, photoUrl } = req.body;
  const item = await MenuItem.update(id, { categoryId, name, description, price, photoUrl });
  if (!item) return res.status(404).json({ error: 'Menu tidak ditemukan' });
  return res.json({ item });
}

async function deactivateMenuItem(req, res) {
  const { id } = req.params;
  const item = await MenuItem.setActive(id, false);
  if (!item) return res.status(404).json({ error: 'Menu tidak ditemukan' });
  return res.json({ message: 'Menu dinonaktifkan', item });
}

module.exports = { listMenuItems, createMenuItem, updateMenuItem, deactivateMenuItem };
