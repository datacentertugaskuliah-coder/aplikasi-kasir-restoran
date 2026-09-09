import { useEffect, useState } from 'react';
import { fetchRevenueSummary, fetchBestSellingItems } from '../services/reportService';

// Dashboard ringkasan pendapatan — halaman utama Owner saat login.
// Akses dari dalam restoran (sesuai PRD, tidak ada akses remote di Fase 1).
export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [bestSelling, setBestSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchRevenueSummary(), fetchBestSellingItems(5)])
      .then(([summaryData, bestSellingData]) => {
        setSummary(summaryData);
        setBestSelling(bestSellingData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat dashboard...</p>;

  return (
    <div className="dashboard-page">
      <h2>Dashboard Owner</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Pendapatan Hari Ini</h3>
          <p>Rp {Number(summary.today_revenue).toLocaleString('id-ID')}</p>
        </div>
        <div className="card">
          <h3>Pendapatan Minggu Ini</h3>
          <p>Rp {Number(summary.week_revenue).toLocaleString('id-ID')}</p>
        </div>
        <div className="card">
          <h3>Pendapatan Bulan Ini</h3>
          <p>Rp {Number(summary.month_revenue).toLocaleString('id-ID')}</p>
        </div>
        <div className="card">
          <h3>Total Transaksi</h3>
          <p>{summary.total_transactions}</p>
        </div>
      </div>

      <h3>Menu Terlaris</h3>
      <ol>
        {bestSelling.map((item) => (
          <li key={item.item_name}>
            {item.item_name} — {item.total_sold} terjual (Rp {Number(item.total_revenue).toLocaleString('id-ID')})
          </li>
        ))}
      </ol>
    </div>
  );
}
