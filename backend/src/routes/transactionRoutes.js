const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  processPayment,
  getTransactionDetail,
  listTransactions,
} = require('../controllers/transactionController');

router.post('/', authenticate, authorize('owner', 'kasir'), processPayment);
router.get('/', authenticate, listTransactions); // riwayat, filter via query ?date=&cashierId=
router.get('/:id', authenticate, getTransactionDetail); // dipakai juga untuk struk digital

module.exports = router;
