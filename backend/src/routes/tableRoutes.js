const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { listTables, createTable } = require('../controllers/tableController');

router.get('/', authenticate, listTables); // semua role login: lihat status meja
router.post('/', authenticate, authorize('owner'), createTable); // hanya Owner tambah meja baru

module.exports = router;
