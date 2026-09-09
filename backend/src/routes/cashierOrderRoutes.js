const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { listActiveOrders, openOrderForPayment } = require('../controllers/cashierOrderController');

router.get('/active', authenticate, listActiveOrders);
router.post('/:id/open-for-payment', authenticate, authorize('owner', 'kasir'), openOrderForPayment);

module.exports = router;

// Route penyelesaian order — dipanggil setelah transaksi/pembayaran berhasil dicatat
const { completeOrder } = require('../controllers/orderCompletionController');
router.post('/:id/complete', authenticate, authorize('owner', 'kasir'), completeOrder);
