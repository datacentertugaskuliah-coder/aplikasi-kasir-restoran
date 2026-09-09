const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  toggleMenuItemAvailability,
  toggleBundleAvailability,
} = require('../controllers/availabilityController');

// Kasir & Pelayan boleh toggle ketersediaan (beda dari CRUD penuh yang khusus Owner)
router.patch(
  '/menu-items/:id',
  authenticate,
  authorize('owner', 'kasir', 'pelayan'),
  toggleMenuItemAvailability
);
router.patch(
  '/bundles/:id',
  authenticate,
  authorize('owner', 'kasir', 'pelayan'),
  toggleBundleAvailability
);

module.exports = router;
