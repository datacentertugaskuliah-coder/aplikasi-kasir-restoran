const db = require('../config/db');

const Transaction = {
  async create({ orderId, cashierId, subtotal, total, amountPaid, changeAmount, items }) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        `INSERT INTO transactions (order_id, cashier_id, subtotal, total, amount_paid, change_amount)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [orderId, cashierId, subtotal, total, amountPaid, changeAmount]
      );
      const transaction = rows[0];

      for (const item of items) {
        await client.query(
          `INSERT INTO transaction_items (transaction_id, item_name, quantity, unit_price, line_total, note)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [transaction.id, item.name, item.quantity, item.unitPrice, item.lineTotal, item.note]
        );
      }

      await client.query('COMMIT');
      return transaction;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async getWithItems(id) {
    const txRes = await db.query(
      `SELECT t.*, u.full_name AS cashier_name
       FROM transactions t JOIN users u ON t.cashier_id = u.id
       WHERE t.id = $1`,
      [id]
    );
    const transaction = txRes.rows[0];
    if (!transaction) return null;

    const itemsRes = await db.query(
      'SELECT * FROM transaction_items WHERE transaction_id = $1',
      [id]
    );
    return { ...transaction, items: itemsRes.rows };
  },

  async listByFilter({ date, cashierId } = {}) {
    let query = `SELECT t.*, u.full_name AS cashier_name
                 FROM transactions t JOIN users u ON t.cashier_id = u.id
                 WHERE 1=1`;
    const params = [];

    if (date) {
      params.push(date);
      query += ` AND DATE(t.created_at) = $${params.length}`;
    }
    if (cashierId) {
      params.push(cashierId);
      query += ` AND t.cashier_id = $${params.length}`;
    }
    query += ' ORDER BY t.created_at DESC';

    const { rows } = await db.query(query, params);
    return rows;
  },
};

module.exports = Transaction;
