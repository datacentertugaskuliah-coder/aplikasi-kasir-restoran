// Model User — merepresentasikan tabel `users` (lihat migrations/001_create_users_roles.sql)
// Fungsi-fungsi berikut mengasumsikan koneksi pg pool tersedia di config/db.js

const db = require('../config/db');

const User = {
  async findByUsername(username) {
    const { rows } = await db.query(
      `SELECT u.*, r.name AS role_name
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.username = $1`,
      [username]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT u.id, u.full_name, u.username, u.is_active, r.name AS role_name
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findAll() {
    const { rows } = await db.query(
      `SELECT u.id, u.full_name, u.username, u.is_active, r.name AS role_name
       FROM users u JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );
    return rows;
  },

  async create({ fullName, username, passwordHash, roleId }) {
    const { rows } = await db.query(
      `INSERT INTO users (full_name, username, password_hash, role_id)
       VALUES ($1, $2, $3, $4) RETURNING id, full_name, username, role_id`,
      [fullName, username, passwordHash, roleId]
    );
    return rows[0];
  },

  async setActive(id, isActive) {
    const { rows } = await db.query(
      `UPDATE users SET is_active = $2, updated_at = NOW() WHERE id = $1 RETURNING id, is_active`,
      [id, isActive]
    );
    return rows[0];
  },

  async update(id, { fullName, username }) {
    const { rows } = await db.query(
      `UPDATE users SET full_name = $2, username = $3, updated_at = NOW()
       WHERE id = $1 RETURNING id, full_name, username`,
      [id, fullName, username]
    );
    return rows[0];
  },
};

module.exports = User;
