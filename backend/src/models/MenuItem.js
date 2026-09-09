const db = require('../config/db');

const MenuItem = {
  async findAll({ onlyAvailable = false } = {}) {
    let query = `SELECT mi.*, c.name AS category_name
                 FROM menu_items mi LEFT JOIN categories c ON mi.category_id = c.id
                 WHERE mi.is_active = TRUE`;
    if (onlyAvailable) query += ' AND mi.is_available = TRUE';
    query += ' ORDER BY c.display_order, mi.name';
    const { rows } = await db.query(query);
    return rows;
  },
  async findById(id) {
    const { rows } = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
    return rows[0] || null;
  },
  async create({ categoryId, name, description, price, photoUrl }) {
    const { rows } = await db.query(
      `INSERT INTO menu_items (category_id, name, description, price, photo_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [categoryId, name, description, price, photoUrl]
    );
    return rows[0];
  },
  async update(id, { categoryId, name, description, price, photoUrl }) {
    const { rows } = await db.query(
      `UPDATE menu_items SET category_id = $2, name = $3, description = $4,
       price = $5, photo_url = $6, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, categoryId, name, description, price, photoUrl]
    );
    return rows[0];
  },
  async setActive(id, isActive) {
    const { rows } = await db.query(
      'UPDATE menu_items SET is_active = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, isActive]
    );
    return rows[0];
  },
  async setAvailable(id, isAvailable) {
    const { rows } = await db.query(
      'UPDATE menu_items SET is_available = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, isAvailable]
    );
    return rows[0];
  },
};

module.exports = MenuItem;
