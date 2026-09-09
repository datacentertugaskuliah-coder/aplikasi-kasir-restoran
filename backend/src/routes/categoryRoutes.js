const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.get('/', authenticate, listCategories); // semua role login bisa lihat
router.post('/', authenticate, authorize('owner'), createCategory);
router.put('/:id', authenticate, authorize('owner'), updateCategory);
router.delete('/:id', authenticate, authorize('owner'), deleteCategory);

module.exports = router;
