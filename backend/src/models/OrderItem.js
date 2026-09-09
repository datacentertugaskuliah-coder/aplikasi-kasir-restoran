const db = require('../config/db');

const OrderItem = {
  async add({ orderId, menuItemId, bundleId, quantity, unitPrice, note }) {
    const { rows } = await db.query(
      `INSERT INTO order_items (order_id, menu_item_id, bundle_id, quantity, unit_price, note)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [orderId, menuItemId || null, bundleId || null, quantity, unitPrice, note || null]
    );
    return rows[0];
  },

  async update(id, { quantity, note }) {
    const { rows } = await db.query(
      `UPDATE order_items SET quantity = $2, note = $3 WHERE id = $1 RETURNING *`,
      [id, quantity, note]
    );
    return rows[0];
  },

  async remove(id) {
    await db.query('DELETE FROM order_items WHERE id = $1', [id]);
  },
};

module.exports = OrderItem;
