import { getToken } from './sessionStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

export async function processPayment(orderId, amountPaid) {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ orderId, amountPaid }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Pembayaran gagal');
  }
  return res.json(); // { transaction }
}

export async function fetchTransactionDetail(id) {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat detail transaksi');
  const data = await res.json();
  return data.transaction;
}

export async function fetchTransactionHistory({ date, cashierId } = {}) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (cashierId) params.append('cashierId', cashierId);

  const res = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal memuat riwayat transaksi');
  const data = await res.json();
  return data.transactions;
}
