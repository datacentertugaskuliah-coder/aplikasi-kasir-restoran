// Controller CRUD kategori menu — hanya Owner (lihat routes/categoryRoutes.js)
const Category = require('../models/Category');

async function listCategories(req, res) {
  const categories = await Category.findAll();
  return res.json({ categories });
}

async function createCategory(req, res) {
  const { name, displayOrder } = req.body;
  if (!name) return res.status(400).json({ error: 'Nama kategori wajib diisi' });
  const category = await Category.create({ name, displayOrder });
  return res.status(201).json({ category });
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, displayOrder } = req.body;
  const category = await Category.update(id, { name, displayOrder });
  if (!category) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
  return res.json({ category });
}

async function deleteCategory(req, res) {
  const { id } = req.params;
  await Category.delete(id);
  return res.json({ message: 'Kategori dihapus' });
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
