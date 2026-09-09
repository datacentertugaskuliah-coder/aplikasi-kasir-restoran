// Controller alur walk-in Kasir: buat order + tambah semua item sekaligus dalam 1 request,
// lebih efisien dibanding memanggil openWalkInOrder lalu addOrderItem berkali-kali secara terpisah
// (endpoint dasarnya sudah ada di orderController.js — ini adalah convenience wrapper untuk Kasir).
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const MenuItem = require('../models/MenuItem');
const Bundle = require('../models/Bundle');

async function createWalkInOrderWithItems(req, res) {
  const { items } = req.body; // [{ menuItemId | bundleId, quantity, note }]
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Minimal 1 item wajib diisi' });
  }

  const order = await Order.create({
    tableId: null,
    orderType: 'walk_in',
    openedByUserId: req.user.userId,
  });

  const addedItems = [];
  for (const entry of items) {
    let unitPrice;
    if (entry.menuItemId) {
      const menuItem = await MenuItem.findById(entry.menuItemId);
      if (!menuItem) continue;
      unitPrice = menuItem.price;
    } else if (entry.bundleId) {
      const bundles = await Bundle.findAll();
      const bundle = bundles.find((b) => b.id === Number(entry.bundleId));
      if (!bundle) continue;
      unitPrice = bundle.bundle_price;
    } else {
      continue;
    }

    const orderItem = await OrderItem.add({
      orderId: order.id,
      menuItemId: entry.menuItemId,
      bundleId: entry.bundleId,
      quantity: entry.quantity || 1,
      unitPrice,
      note: entry.note,
    });
    addedItems.push(orderItem);
  }

  return res.status(201).json({ order, items: addedItems });
}

module.exports = { createWalkInOrderWithItems };
