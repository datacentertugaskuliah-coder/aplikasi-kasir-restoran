const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  getDailySales,
  getPeriodicSales,
  getBestSellingItems,
  getSalesByCashier,
  getRevenueSummary,
} = require('../controllers/reportController');

// Semua route laporan dibatasi Owner (lihat PRD: laporan hanya diakses Owner dari dalam restoran)
router.use(authenticate, authorize('owner'));

router.get('/sales/daily', getDailySales);
router.get('/sales/periodic', getPeriodicSales); // ?period=week|month
router.get('/best-selling', getBestSellingItems); // ?limit=10
router.get('/sales/by-cashier', getSalesByCashier);
router.get('/summary', getRevenueSummary); // dipakai dashboard Owner

module.exports = router;
