// Controller order: buka order per meja (Pelayan), tambah/edit/hapus item, catatan khusus.
// Juga dipakai Kasir untuk alur walk-in (order tanpa meja).
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const Bundle = require('../models/Bundle');

// Pelayan: buka order baru untuk sebuah meja (atau ambil order yang sudah terbuka)
async function openTableOrder(req, res) {
  const { tableId } = req.body;
  if (!tableId) return res.status(400).json({ error: 'tableId wajib diisi' });

  const existing = await Order.findOpenByTable(tableId);
  if (existing) return res.json({ order: existing, alreadyOpen: true });

  const order = await Order.create({
    tableId,
    orderType: 'dine_in',
    openedByUserId: req.user.userId,
  });
  await Table.setStatus(tableId, 'occupied');
  return res.status(201).json({ order });
}

// Kasir: buat order walk-in langsung (tanpa meja)
async function openWalkInOrder(req, res) {
  const order = await Order.create({
    tableId: null,
    orderType: 'walk_in',
    openedByUserId: req.user.userId,
  });
  return res.status(201).json({ order });
}

async function getOrderDetail(req, res) {
  const { id } = req.params;
  const order = await Order.getWithItems(id);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
  return res.json({ order });
}

// Tambah item ke order — harga diambil dari menu saat ini (snapshot ke order_items.unit_price)
async function addOrderItem(req, res) {
  const { id: orderId } = req.params;
  const { menuItemId, bundleId, quantity = 1, note } = req.body;

  if (!menuItemId && !bundleId) {
    return res.status(400).json({ error: 'menuItemId atau bundleId wajib diisi' });
  }

  let unitPrice;
  if (menuItemId) {
    const item = await MenuItem.findById(menuItemId);
    if (!item) return res.status(404).json({ error: 'Menu tidak ditemukan' });
    unitPrice = item.price;
  } else {
    const bundleRes = await Bundle.findAll();
    const bundle = bundleRes.find((b) => b.id === Number(bundleId));
    if (!bundle) return res.status(404).json({ error: 'Paket tidak ditemukan' });
    unitPrice = bundle.bundle_price;
  }

  const orderItem = await OrderItem.add({ orderId, menuItemId, bundleId, quantity, unitPrice, note });
  return res.status(201).json({ orderItem });
}

async function updateOrderItem(req, res) {
  const { itemId } = req.params;
  const { quantity, note } = req.body;
  const orderItem = await OrderItem.update(itemId, { quantity, note });
  if (!orderItem) return res.status(404).json({ error: 'Item order tidak ditemukan' });
  return res.json({ orderItem });
}

async function removeOrderItem(req, res) {
  const { itemId } = req.params;
  await OrderItem.remove(itemId);
  return res.json({ message: 'Item dihapus dari order' });
}

module.exports = {
  openTableOrder,
  openWalkInOrder,
  getOrderDetail,
  addOrderItem,
  updateOrderItem,
  removeOrderItem,
};
