import { getToken } from './sessionStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
// Interval polling untuk sinkronisasi order antar device (pelayan -> kasir).
// Dipilih polling (bukan WebSocket) karena skala single-outlet, lebih sederhana untuk di-maintain.
export const ORDER_POLL_INTERVAL_MS = 4000;

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

export async function fetchTables() {
  const res = await fetch(`${API_BASE_URL}/tables`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat daftar meja');
  const data = await res.json();
  return data.tables;
}

export async function fetchActiveOrders() {
  const res = await fetch(`${API_BASE_URL}/orders/active`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat order aktif');
  const data = await res.json();
  return data.orders;
}

export async function openTableOrder(tableId) {
  const res = await fetch(`${API_BASE_URL}/orders/table`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ tableId }),
  });
  if (!res.ok) throw new Error('Gagal membuka order');
  return res.json();
}

export async function getOrderDetail(orderId) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat detail order');
  const data = await res.json();
  return data.order;
}

export async function addOrderItem(orderId, payload) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Gagal menambah item');
  return res.json();
}

// Hook sederhana: polling berkala untuk sinkronisasi antar device.
// Dipanggil dari komponen dengan useEffect + setInterval memanggil fungsi ini.
export function startOrderPolling(callback, intervalMs = ORDER_POLL_INTERVAL_MS) {
  const id = setInterval(async () => {
    try {
      const orders = await fetchActiveOrders();
      callback(orders);
    } catch (err) {
      console.error('Polling order gagal:', err);
    }
  }, intervalMs);
  return () => clearInterval(id); // fungsi cleanup untuk useEffect
}
