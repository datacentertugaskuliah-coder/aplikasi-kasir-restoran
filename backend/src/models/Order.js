const db = require('../config/db');

const Order = {
  async findOpenByTable(tableId) {
    const { rows } = await db.query(
      `SELECT * FROM orders WHERE table_id = $1 AND status IN ('open', 'awaiting_payment')`,
      [tableId]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create({ tableId, orderType, openedByUserId }) {
    const { rows } = await db.query(
      `INSERT INTO orders (table_id, order_type, opened_by_user_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [tableId, orderType, openedByUserId]
    );
    return rows[0];
  },

  async setStatus(id, status) {
    const { rows } = await db.query(
      `UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, status]
    );
    return rows[0];
  },

  async getWithItems(id) {
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    const order = orderRes.rows[0];
    if (!order) return null;

    const itemsRes = await db.query(
      `SELECT oi.*, mi.name AS menu_item_name, b.name AS bundle_name
       FROM order_items oi
       LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
       LEFT JOIN bundles b ON oi.bundle_id = b.id
       WHERE oi.order_id = $1
       ORDER BY oi.created_at`,
      [id]
    );
    return { ...order, items: itemsRes.rows };
  },

  async listActive() {
    const { rows } = await db.query(
      `SELECT o.*, t.table_number
       FROM orders o LEFT JOIN tables t ON o.table_id = t.id
       WHERE o.status IN ('open', 'awaiting_payment')
       ORDER BY o.created_at`
    );
    return rows;
  },
};

module.exports = Order;
