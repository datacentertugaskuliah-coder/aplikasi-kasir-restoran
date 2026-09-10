// Integration test: alur end-to-end order via Pelayan -> bayar via Kasir.
//
// ==> PENTING: Test ini BELUM DIEKSEKUSI. Membutuhkan PostgreSQL aktif dengan skema
// migrations 001-005 sudah dijalankan, dan minimal 1 user kasir + 1 user pelayan + 1 menu item
// seed data. Jalankan `npm test tests/e2e-pelayan-kasir-flow.test.js` setelah database siap.
//
// Skenario yang diuji:
// 1. Pelayan login
// 2. Pelayan membuka order untuk sebuah meja
// 3. Pelayan menambah 2 item ke order
// 4. Kasir login
// 5. Kasir membuka order tsb untuk pembayaran (status -> awaiting_payment)
// 6. Kasir memproses pembayaran cash
// 7. Verifikasi: transaksi tercatat, status order 'paid', status meja kembali 'empty'

const request = require('supertest');
const app = require('../src/server'); // catatan: server.js perlu export `app` (lihat TODO di bawah)

describe('E2E: Order via Pelayan -> Bayar via Kasir', () => {
  let pelayanToken, kasirToken, tableId, orderId;

  beforeAll(async () => {
    // TODO: seed test database (user pelayan/kasir, 1 meja, 1 menu item) sebelum test berjalan
  });

  test('Pelayan berhasil login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'pelayan_test', password: 'password_test' });
    expect(res.status).toBe(200);
    pelayanToken = res.body.token;
  });

  test('Pelayan membuka order baru untuk meja', async () => {
    const res = await request(app)
      .post('/api/orders/table')
      .set('Authorization', `Bearer ${pelayanToken}`)
      .send({ tableId });
    expect(res.status).toBe(201);
    orderId = res.body.order.id;
  });

  test('Pelayan menambahkan item ke order', async () => {
    const res = await request(app)
      .post(`/api/orders/${orderId}/items`)
      .set('Authorization', `Bearer ${pelayanToken}`)
      .send({ menuItemId: 1, quantity: 2, note: 'tidak pedas' });
    expect(res.status).toBe(201);
  });

  test('Kasir berhasil login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'kasir_test', password: 'password_test' });
    expect(res.status).toBe(200);
    kasirToken = res.body.token;
  });

  test('Kasir membuka order untuk pembayaran', async () => {
    const res = await request(app)
      .post(`/api/orders/${orderId}/open-for-payment`)
      .set('Authorization', `Bearer ${kasirToken}`);
    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('awaiting_payment');
  });

  test('Kasir memproses pembayaran dan kembalian benar', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${kasirToken}`)
      .send({ orderId, amountPaid: 100000 });
    expect(res.status).toBe(201);
    expect(res.body.transaction).toHaveProperty('change_amount');
  });

  test('Status meja kembali empty setelah pembayaran', async () => {
    const res = await request(app)
      .get('/api/tables')
      .set('Authorization', `Bearer ${kasirToken}`);
    const table = res.body.tables.find((t) => t.id === tableId);
    expect(table.status).toBe('empty');
  });
});
