// Integration test: alur end-to-end order langsung via Kasir (walk-in, tanpa meja).
//
// ==> PENTING: Test ini BELUM DIEKSEKUSI. Membutuhkan PostgreSQL aktif dengan seed data
// (user kasir, minimal 1 menu item). Jalankan setelah database siap:
// npm test tests/e2e-walkin-flow.test.js
//
// Skenario yang diuji:
// 1. Kasir login
// 2. Kasir membuat order walk-in + tambah item sekaligus (endpoint quick order)
// 3. Kasir langsung memproses pembayaran (tanpa tahap "buka untuk pembayaran" seperti dine-in,
//    karena walk-in tidak terikat status meja)
// 4. Verifikasi transaksi tercatat dengan benar, order_type = 'walk_in'

const request = require('supertest');
const app = require('../src/server');

describe('E2E: Order Walk-in langsung via Kasir', () => {
  let kasirToken, orderId;

  test('Kasir berhasil login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'kasir_test', password: 'password_test' });
    expect(res.status).toBe(200);
    kasirToken = res.body.token;
  });

  test('Kasir membuat order walk-in dengan beberapa item sekaligus', async () => {
    const res = await request(app)
      .post('/api/orders/walk-in/quick')
      .set('Authorization', `Bearer ${kasirToken}`)
      .send({
        items: [
          { menuItemId: 1, quantity: 1 },
          { menuItemId: 2, quantity: 2 },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.items.length).toBe(2);
    orderId = res.body.order.id;
    expect(res.body.order.order_type).toBe('walk_in');
  });

  test('Kasir memproses pembayaran untuk order walk-in', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${kasirToken}`)
      .send({ orderId, amountPaid: 200000 });
    expect(res.status).toBe(201);
    expect(res.body.transaction).toHaveProperty('id');
    expect(Number(res.body.transaction.change_amount)).toBeGreaterThanOrEqual(0);
  });

  test('Transaksi walk-in muncul di riwayat transaksi', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${kasirToken}`);
    expect(res.status).toBe(200);
    const found = res.body.transactions.some((t) => t.order_id === orderId);
    expect(found).toBe(true);
  });
});
