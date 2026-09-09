import { useEffect, useState } from 'react';
import { fetchTransactionHistory } from '../services/transactionService';

// Halaman riwayat transaksi — filter by tanggal dan/atau kasir.
export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadTransactions() {
    setLoading(true);
    try {
      const data = await fetchTransactionHistory({ date: date || undefined });
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="transaction-history-page">
      <h2>Riwayat Transaksi</h2>
      <div className="filter-bar">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={loadTransactions}>Filter</button>
      </div>

      {loading ? (
        <p>Memuat...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Waktu</th>
              <th>Kasir</th>
              <th>Total</th>
              <th>Dibayar</th>
              <th>Kembalian</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>#{tx.id}</td>
                <td>{new Date(tx.created_at).toLocaleString('id-ID')}</td>
                <td>{tx.cashier_name}</td>
                <td>Rp {Number(tx.total).toLocaleString('id-ID')}</td>
                <td>Rp {Number(tx.amount_paid).toLocaleString('id-ID')}</td>
                <td>Rp {Number(tx.change_amount).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
