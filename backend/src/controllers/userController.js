// Controller CRUD user — hanya dapat diakses Owner (lihat routes/userRoutes.js)
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const db = require('../config/db');

async function listUsers(req, res) {
  const users = await User.findAll();
  return res.json({ users });
}

async function createUser(req, res) {
  try {
    const { fullName, username, password, role } = req.body;
    if (!fullName || !username || !password || !role) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }

    const { rows: roleRows } = await db.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleRows.length === 0) {
      return res.status(400).json({ error: 'Role tidak valid' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      username,
      passwordHash,
      roleId: roleRows[0].id,
    });

    return res.status(201).json({ user: newUser });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { fullName, username } = req.body;
  const updated = await User.update(id, { fullName, username });
  if (!updated) return res.status(404).json({ error: 'User tidak ditemukan' });
  return res.json({ user: updated });
}

async function deactivateUser(req, res) {
  const { id } = req.params;
  const result = await User.setActive(id, false);
  if (!result) return res.status(404).json({ error: 'User tidak ditemukan' });
  return res.json({ message: 'User dinonaktifkan', user: result });
}

async function activateUser(req, res) {
  const { id } = req.params;
  const result = await User.setActive(id, true);
  if (!result) return res.status(404).json({ error: 'User tidak ditemukan' });
  return res.json({ message: 'User diaktifkan', user: result });
}

module.exports = { listUsers, createUser, updateUser, deactivateUser, activateUser };
