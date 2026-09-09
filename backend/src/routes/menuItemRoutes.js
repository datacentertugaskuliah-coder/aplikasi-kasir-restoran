const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  listMenuItems,
  createMenuItem,
  updateMenuItem,
  deactivateMenuItem,
} = require('../controllers/menuItemController');

router.get('/', authenticate, listMenuItems);
router.post('/', authenticate, authorize('owner'), createMenuItem);
router.put('/:id', authenticate, authorize('owner'), updateMenuItem);
router.delete('/:id', authenticate, authorize('owner'), deactivateMenuItem);

module.exports = router;
