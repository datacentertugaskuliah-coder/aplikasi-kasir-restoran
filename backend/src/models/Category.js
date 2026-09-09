const db = require('../config/db');

const Category = {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY display_order, name');
    return rows;
  },
  async create({ name, displayOrder = 0 }) {
    const { rows } = await db.query(
      'INSERT INTO categories (name, display_order) VALUES ($1, $2) RETURNING *',
      [name, displayOrder]
    );
    return rows[0];
  },
  async update(id, { name, displayOrder }) {
    const { rows } = await db.query(
      'UPDATE categories SET name = $2, display_order = $3 WHERE id = $1 RETURNING *',
      [id, name, displayOrder]
    );
    return rows[0];
  },
  async delete(id) {
    await db.query('DELETE FROM categories WHERE id = $1', [id]);
  },
};

module.exports = Category;
