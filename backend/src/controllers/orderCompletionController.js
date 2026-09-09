// Controller: menyelesaikan order (dipanggil setelah pembayaran berhasil di transactionController
// pada bagian Transaksi & Pembayaran nanti). Disiapkan di sini agar update status meja
// otomatis konsisten dengan siklus hidup order.
const Order = require('../models/Order');
const Table = require('../models/Table');

async function completeOrder(req, res) {
  const { id } = req.params;
  const order = await Order.getWithItems(id);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

  const updated = await Order.setStatus(id, 'paid');

  // Update status meja otomatis setelah pembayaran selesai -> kembali kosong
  if (order.table_id) {
    await Table.setStatus(order.table_id, 'empty');
  }

  return res.json({ order: { ...order, status: updated.status } });
}

module.exports = { completeOrder };
