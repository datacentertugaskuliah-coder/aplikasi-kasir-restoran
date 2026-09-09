import { useEffect, useState } from 'react';
import { fetchTransactionDetail } from '../services/transactionService';

// Struk digital — ditampilkan setelah transaksi selesai (basis untuk cetak fisik di Fase 2).
export default function ReceiptPage({ transactionId }) {
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    fetchTransactionDetail(transactionId).then(setTransaction);
  }, [transactionId]);

  if (!transaction) return <p>Memuat struk...</p>;

  return (
    <div className="receipt">
      <h2>Struk Pembayaran</h2>
      <p>No. Transaksi: #{transaction.id}</p>
      <p>Waktu: {new Date(transaction.created_at).toLocaleString('id-ID')}</p>
      <p>Kasir: {transaction.cashier_name}</p>
      <hr />
      <table>
        <tbody>
          {transaction.items.map((item) => (
            <tr key={item.id}>
              <td>{item.item_name} x{item.quantity}</td>
              <td>Rp {Number(item.line_total).toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <p>Subtotal: Rp {Number(transaction.subtotal).toLocaleString('id-ID')}</p>
      <p><strong>Total: Rp {Number(transaction.total).toLocaleString('id-ID')}</strong></p>
      <p>Dibayar: Rp {Number(transaction.amount_paid).toLocaleString('id-ID')}</p>
      <p>Kembalian: Rp {Number(transaction.change_amount).toLocaleString('id-ID')}</p>
      <p className="thank-you">Terima kasih!</p>
    </div>
  );
}
