# Task List — Implementasi Aplikasi Kasir Restoran

**Referensi:** `doc/PRD_Aplikasi_Kasir_Restoran.md`
**Tanggal dibuat:** 9 September 2026
**Status:** To Do

Task list ini disusun mengikuti roadmap 4 fase pada PRD. Checklist bisa dicentang langsung di GitHub (render sebagai checkbox interaktif).

---

## Fase 0 — Project Setup

- [ ] Inisialisasi project (pilih stack: frontend framework, backend, database)
- [ ] Setup struktur folder project (frontend/backend/shared)
- [ ] Setup environment config (.env, .env.example)
- [ ] Setup linter & formatter (ESLint/Prettier atau setara)
- [ ] Setup database schema awal (users, roles)
- [ ] Konfigurasi CI dasar (opsional, lint/test on push)

---

## Fase 1 — MVP (Prioritas Utama)

### 1. Autentikasi & Manajemen User
- [ ] Skema database: tabel `users` (id, nama, username, password_hash, role)
- [ ] Endpoint/logic login per role (Kasir, Pelayan, Owner)
- [ ] Middleware/guard otorisasi berdasarkan role
- [ ] Halaman login (UI, tablet-friendly)
- [ ] CRUD user oleh Owner (tambah/edit/nonaktifkan akun kasir & pelayan)
- [ ] Session/token handling & logout

### 2. Manajemen Menu
- [ ] Skema database: tabel `categories`, `menu_items`, `bundles` (paket)
- [ ] CRUD kategori menu (Owner)
- [ ] CRUD item menu: nama, harga, deskripsi, foto (opsional), status aktif/nonaktif
- [ ] CRUD paket/bundling menu (kombinasi item + harga khusus)
- [ ] Toggle ketersediaan menu (habis/tersedia) — bisa diakses Kasir/Pelayan
- [ ] Halaman/list menu untuk dipilih saat input order (grid tablet-friendly)

### 3. Manajemen Meja & Order
- [ ] Skema database: tabel `tables` (nomor meja, status), `orders`, `order_items`
- [ ] Daftar meja dengan status visual (kosong/terisi/menunggu pembayaran)
- [ ] Pelayan: buka order baru per meja
- [ ] Tambah/edit/hapus item dalam order (sebelum dibayar)
- [ ] Catatan khusus per item (misal "tidak pedas")
- [ ] Sinkronisasi order antar device (pelayan → kasir) real-time atau polling
- [ ] Kasir: lihat & buka order per meja untuk proses pembayaran
- [ ] Update status meja otomatis setelah pembayaran selesai

### 4. Transaksi & Pembayaran
- [ ] Skema database: tabel `transactions`, `transaction_items`
- [ ] Alur input order langsung oleh Kasir (walk-in)
- [ ] Proses pembayaran cash + kalkulasi kembalian otomatis
- [ ] Simpan riwayat transaksi harian (dengan referensi kasir yang memproses)
- [ ] Halaman riwayat transaksi (filter by tanggal/kasir)
- [ ] Struk digital (tampilan ringkasan setelah transaksi selesai)

### 5. Manajemen Stok/Inventory (dasar)
- [ ] Skema database: tabel `stock` terhubung ke menu item
- [ ] Input/update stok manual oleh Owner/Kasir
- [ ] Notifikasi/badge stok menipis atau habis
- [ ] Auto-nonaktifkan menu saat stok habis (opsional toggle)

### 6. Laporan & Analitik (dasar)
- [ ] Laporan penjualan harian
- [ ] Laporan penjualan mingguan/bulanan
- [ ] Ranking menu terlaris
- [ ] Total transaksi per kasir
- [ ] Dashboard ringkasan pendapatan (akses Owner, dari dalam restoran)

### 7. UI/UX Tablet
- [ ] Desain layout responsif khusus tablet (touch-friendly, tombol besar)
- [ ] Navigasi role-based (menu berbeda untuk Kasir/Pelayan/Owner)
- [ ] Testing di ukuran layar tablet umum (iPad, Android tablet)

### 8. Testing & QA Fase 1
- [ ] Unit test untuk logic transaksi & kalkulasi kembalian
- [ ] Test alur end-to-end: order via pelayan → bayar via kasir
- [ ] Test alur end-to-end: order langsung via kasir (walk-in)
- [ ] User acceptance testing bareng kasir/pelayan asli di restoran

### 9. Deployment Fase 1
- [ ] Setup hosting (web app + database)
- [ ] Deploy versi staging untuk uji coba internal
- [ ] Deploy versi production
- [ ] Training singkat untuk kasir & pelayan

---

## Fase 2 — Pembayaran Digital & Cetak

- [ ] Integrasi metode pembayaran QRIS/e-wallet
- [ ] Integrasi printer struk fisik
- [ ] Integrasi kitchen printer (opsional, jika dibutuhkan alur dapur)

---

## Fase 3 — Skalabilitas

- [ ] Dukungan multi-outlet/multi-cabang
- [ ] Akses laporan remote (di luar restoran, misal via HP owner)
- [ ] Integrasi accounting/pajak (e-Faktur, dsb)

---

## Fase 4 — Ekspansi Channel

- [ ] Self-order pelanggan via QR code/kiosk
- [ ] Integrasi platform online order (GoFood, GrabFood, dsb)

---

## Catatan: Perlu Klarifikasi Sebelum/Selama Development

Beberapa item di bawah masih "Open Questions" di PRD dan mempengaruhi task di atas — perlu dijawab sebelum implementasi fitur terkait selesai 100%:

- [ ] Mode koneksi: online-only vs offline-first?
- [ ] Kebutuhan cetak struk fisik di Fase 1 (meski tanpa printer khusus)?
- [ ] Kebutuhan split bill meski pembayaran cash-only?
- [ ] Aturan pajak (PB1) / service charge dan persentasenya?
- [ ] Model stok: per menu jadi atau per bahan baku (resep)?
- [ ] Perkiraan jumlah meja yang perlu dikelola?
- [ ] Kewenangan void/pembatalan order (kasir saja / perlu approval owner)?
- [ ] Kebutuhan sistem buka/tutup shift kasir dengan rekonsiliasi kas?
