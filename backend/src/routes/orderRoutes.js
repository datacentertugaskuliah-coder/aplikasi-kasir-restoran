const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  openTableOrder,
  openWalkInOrder,
  getOrderDetail,
  addOrderItem,
  updateOrderItem,
  removeOrderItem,
} = require('../controllers/orderController');

router.post('/table', authenticate, authorize('owner', 'pelayan', 'kasir'), openTableOrder);
router.post('/walk-in', authenticate, authorize('owner', 'kasir'), openWalkInOrder);
router.get('/:id', authenticate, getOrderDetail);
router.post('/:id/items', authenticate, authorize('owner', 'pelayan', 'kasir'), addOrderItem);
router.put('/:id/items/:itemId', authenticate, authorize('owner', 'pelayan', 'kasir'), updateOrderItem);
router.delete('/:id/items/:itemId', authenticate, authorize('owner', 'pelayan', 'kasir'), removeOrderItem);

module.exports = router;

// Convenience endpoint Kasir: buat order walk-in + tambah semua item sekaligus
const { createWalkInOrderWithItems } = require('../controllers/walkInController');
router.post('/walk-in/quick', authenticate, authorize('owner', 'kasir'), createWalkInOrderWithItems);
