// Controller pembayaran cash — kalkulasi kembalian otomatis, simpan riwayat transaksi harian.
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const Table = require('../models/Table');
const { calculateSubtotal, calculateTotal, calculateChange } = require('../utils/paymentCalculator');

// Proses pembayaran cash untuk sebuah order.
// Kalkulasi kembalian dilakukan di server (bukan percaya input client) untuk menghindari manipulasi.
async function processPayment(req, res) {
  const { orderId, amountPaid } = req.body;
  if (!orderId || amountPaid === undefined) {
    return res.status(400).json({ error: 'orderId dan amountPaid wajib diisi' });
  }

  const order = await Order.getWithItems(orderId);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
  if (order.status === 'paid') {
    return res.status(409).json({ error: 'Order ini sudah dibayar sebelumnya' });
  }

  const subtotal = calculateSubtotal(order.items);
  const total = calculateTotal(subtotal); // pajak/service charge belum diterapkan di Fase 1

  let changeAmount;
  try {
    changeAmount = calculateChange(amountPaid, total);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const transaction = await Transaction.create({
    orderId,
    cashierId: req.user.userId,
    subtotal,
    total,
    amountPaid,
    changeAmount,
    items: order.items.map((item) => ({
      name: item.menu_item_name || item.bundle_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: Number(item.unit_price) * item.quantity,
      note: item.note,
    })),
  });

  // Selesaikan order & update status meja otomatis (reuse logic dari orderCompletionController)
  await Order.setStatus(orderId, 'paid');
  if (order.table_id) {
    await Table.setStatus(order.table_id, 'empty');
  }

  return res.status(201).json({ transaction });
}

async function getTransactionDetail(req, res) {
  const { id } = req.params;
  const transaction = await Transaction.getWithItems(id);
  if (!transaction) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
  return res.json({ transaction });
}

// Riwayat transaksi harian — filter opsional by tanggal dan/atau kasir
async function listTransactions(req, res) {
  const { date, cashierId } = req.query;
  const transactions = await Transaction.listByFilter({ date, cashierId });
  return res.json({ transactions });
}

module.exports = { processPayment, getTransactionDetail, listTransactions };
