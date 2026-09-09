import { getToken } from './sessionStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function fetchRevenueSummary() {
  const res = await fetch(`${API_BASE_URL}/reports/summary`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat ringkasan pendapatan');
  const data = await res.json();
  return data.summary;
}

export async function fetchDailySales(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/reports/sales/daily?${query}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat laporan harian');
  const data = await res.json();
  return data.report;
}

export async function fetchBestSellingItems(limit = 10) {
  const res = await fetch(`${API_BASE_URL}/reports/best-selling?limit=${limit}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat menu terlaris');
  const data = await res.json();
  return data.report;
}

export async function fetchSalesByCashier(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/reports/sales/by-cashier?${query}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal memuat laporan per kasir');
  const data = await res.json();
  return data.report;
}
