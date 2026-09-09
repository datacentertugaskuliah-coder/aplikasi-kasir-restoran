const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  listUsers,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
} = require('../controllers/userController');

// Semua route di bawah ini hanya bisa diakses oleh Owner
router.use(authenticate, authorize('owner'));

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/deactivate', deactivateUser);
router.patch('/:id/activate', activateUser);

module.exports = router;
