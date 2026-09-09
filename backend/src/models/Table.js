const db = require('../config/db');

const Table = {
  async findAll() {
    const { rows } = await db.query(
      `SELECT t.*, o.id AS active_order_id
       FROM tables t
       LEFT JOIN orders o ON o.table_id = t.id AND o.status IN ('open', 'awaiting_payment')
       ORDER BY t.table_number`
    );
    return rows;
  },
  async findById(id) {
    const { rows } = await db.query('SELECT * FROM tables WHERE id = $1', [id]);
    return rows[0] || null;
  },
  async create(tableNumber) {
    const { rows } = await db.query(
      'INSERT INTO tables (table_number) VALUES ($1) RETURNING *',
      [tableNumber]
    );
    return rows[0];
  },
  async setStatus(id, status) {
    const { rows } = await db.query(
      'UPDATE tables SET status = $2 WHERE id = $1 RETURNING *',
      [id, status]
    );
    return rows[0];
  },
};

module.exports = Table;
