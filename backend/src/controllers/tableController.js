// Controller daftar meja — status visual (kosong/terisi/menunggu pembayaran)
const Table = require('../models/Table');

async function listTables(req, res) {
  const tables = await Table.findAll();
  return res.json({ tables });
}

async function createTable(req, res) {
  const { tableNumber } = req.body;
  if (!tableNumber) return res.status(400).json({ error: 'Nomor meja wajib diisi' });
  const table = await Table.create(tableNumber);
  return res.status(201).json({ table });
}

module.exports = { listTables, createTable };
