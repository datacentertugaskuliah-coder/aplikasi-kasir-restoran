// Controller untuk login & informasi user yang sedang login
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    const user = await User.findByUsername(username);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        role: user.role_name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

async function me(req, res) {
  // req.user diisi oleh middleware authenticate
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
  return res.json({ user });
}

function logout(req, res) {
  // Karena JWT stateless, logout cukup dilakukan di sisi client (hapus token).
  // Endpoint ini disediakan untuk konsistensi API & kemungkinan blacklist token di masa depan.
  return res.json({ message: 'Logout berhasil' });
}

module.exports = { login, me, logout };
