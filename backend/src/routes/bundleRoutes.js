const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { listBundles, createBundle, deactivateBundle } = require('../controllers/bundleController');

router.get('/', authenticate, listBundles);
router.post('/', authenticate, authorize('owner'), createBundle);
router.delete('/:id', authenticate, authorize('owner'), deactivateBundle);

module.exports = router;
