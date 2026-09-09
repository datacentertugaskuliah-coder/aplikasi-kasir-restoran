// Controller khusus alur Kasir: melihat order per meja untuk proses pembayaran.
// Terpisah dari orderController.js (yang fokus ke pembuatan/edit order oleh Pelayan).
const Order = require('../models/Order');
const Table = require('../models/Table');

// Kasir: lihat semua order yang aktif (siap dilihat untuk proses bayar)
async function listActiveOrders(req, res) {
  const orders = await Order.listActive();
  return res.json({ orders });
}

// Kasir: buka order per meja untuk mulai proses pembayaran
// Order dikunci (status -> awaiting_payment) supaya tidak diedit pelayan saat kasir sedang proses
async function openOrderForPayment(req, res) {
  const { id } = req.params;
  const order = await Order.getWithItems(id);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

  const updated = await Order.setStatus(id, 'awaiting_payment');
  if (order.table_id) {
    await Table.setStatus(order.table_id, 'awaiting_payment');
  }
  return res.json({ order: { ...order, status: updated.status } });
}

module.exports = { listActiveOrders, openOrderForPayment };
