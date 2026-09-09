import { getToken } from './sessionStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

export async function fetchMenuItems() {
  const res = await fetch(`${API_BASE_URL}/menu-items`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat menu');
  const data = await res.json();
  return data.items;
}

export async function fetchBundles() {
  const res = await fetch(`${API_BASE_URL}/bundles`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat paket');
  const data = await res.json();
  return data.bundles;
}

export async function toggleAvailability(id, isAvailable, type = 'menu-items') {
  const res = await fetch(`${API_BASE_URL}/availability/${type}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ isAvailable }),
  });
  if (!res.ok) throw new Error('Gagal update ketersediaan');
  return res.json();
}
