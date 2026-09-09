// Model Report — kumpulan query agregasi untuk laporan & analitik.
// Semua dihitung dari `transactions`/`transaction_items` (data final pasca-bayar),
// bukan dari `orders` yang statusnya masih bisa berubah/dibatalkan.
const db = require('../config/db');

const Report = {
  // Laporan penjualan harian — total transaksi & omzet per hari dalam rentang tanggal
  async dailySales({ startDate, endDate } = {}) {
    const params = [];
    let query = `SELECT DATE(created_at) AS date,
                    COUNT(*) AS transaction_count,
                    SUM(total) AS total_revenue
                  FROM transactions WHERE 1=1`;
    if (startDate) {
      params.push(startDate);
      query += ` AND DATE(created_at) >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND DATE(created_at) <= $${params.length}`;
    }
    query += ' GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC';
    const { rows } = await db.query(query, params);
    return rows;
  },

  // Laporan penjualan mingguan (per ISO week) atau bulanan
  async periodicSales({ period = 'week' } = {}) {
    const trunc = period === 'month' ? 'month' : 'week';
    const { rows } = await db.query(
      `SELECT DATE_TRUNC('${trunc}', created_at) AS period_start,
              COUNT(*) AS transaction_count,
              SUM(total) AS total_revenue
       FROM transactions
       GROUP BY DATE_TRUNC('${trunc}', created_at)
       ORDER BY period_start DESC`
    );
    return rows;
  },

  // Ranking menu terlaris berdasarkan jumlah terjual
  async bestSellingItems({ limit = 10 } = {}) {
    const { rows } = await db.query(
      `SELECT item_name, SUM(quantity) AS total_sold, SUM(line_total) AS total_revenue
       FROM transaction_items
       GROUP BY item_name
       ORDER BY total_sold DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  },

  // Total transaksi per kasir
  async salesByCashier({ startDate, endDate } = {}) {
    const params = [];
    let query = `SELECT t.cashier_id, u.full_name AS cashier_name,
                    COUNT(*) AS transaction_count,
                    SUM(t.total) AS total_revenue
                  FROM transactions t JOIN users u ON t.cashier_id = u.id
                  WHERE 1=1`;
    if (startDate) {
      params.push(startDate);
      query += ` AND DATE(t.created_at) >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND DATE(t.created_at) <= $${params.length}`;
    }
    query += ' GROUP BY t.cashier_id, u.full_name ORDER BY total_revenue DESC';
    const { rows } = await db.query(query, params);
    return rows;
  },

  // Ringkasan pendapatan keseluruhan (untuk dashboard Owner)
  async revenueSummary() {
    const { rows } = await db.query(
      `SELECT
         COUNT(*) AS total_transactions,
         COALESCE(SUM(total), 0) AS total_revenue,
         COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total ELSE 0 END), 0) AS today_revenue,
         COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('week', NOW()) THEN total ELSE 0 END), 0) AS week_revenue,
         COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', NOW()) THEN total ELSE 0 END), 0) AS month_revenue
       FROM transactions`
    );
    return rows[0];
  },
};

module.exports = Report;
