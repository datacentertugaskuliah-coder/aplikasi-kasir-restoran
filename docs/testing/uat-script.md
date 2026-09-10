# Skrip User Acceptance Testing (UAT)

**Tujuan:** memverifikasi aplikasi benar-benar bisa dipakai oleh Kasir dan Pelayan asli di restoran, dalam kondisi kerja nyata (bukan sekadar lolos test otomatis).

**Prasyarat sebelum UAT dimulai:**
- Aplikasi sudah di-deploy ke lingkungan staging/lokal dan bisa diakses dari tablet restoran
- Minimal 1 akun Kasir dan 1 akun Pelayan sudah dibuat oleh Owner
- Data menu awal (kategori + beberapa item + 1 paket) sudah diinput
- Minimal 3-5 meja sudah didaftarkan di sistem

## Sesi 1 — Peran Pelayan (durasi ~20 menit)
Damping oleh 1 pelayan asli, gunakan tablet sungguhan di lantai restoran (bukan meja kantor).

| # | Skenario | Berhasil? | Catatan |
|---|----------|-----------|---------|
| 1 | Login sebagai pelayan | ☐ | |
| 2 | Buka order baru untuk meja kosong | ☐ | |
| 3 | Tambahkan 3 item berbeda ke order, salah satunya beri catatan "tidak pedas" | ☐ | |
| 4 | Tambahkan 1 paket/bundling ke order yang sama | ☐ | |
| 5 | Edit jumlah salah satu item (misal dari 1 jadi 2) | ☐ | |
| 6 | Hapus 1 item dari order | ☐ | |
| 7 | Cek: apakah tampilan menu mudah dibaca & tombol mudah ditekan sambil berdiri/berjalan? | ☐ | |
| 8 | Buka order untuk meja kedua (order berbeda berjalan bersamaan) | ☐ | |

## Sesi 2 — Peran Kasir (durasi ~20 menit)
Damping oleh 1 kasir asli.

| # | Skenario | Berhasil? | Catatan |
|---|----------|-----------|---------|
| 1 | Login sebagai kasir | ☐ | |
| 2 | Lihat daftar meja — pastikan order dari Sesi 1 (Pelayan) muncul otomatis tanpa refresh manual | ☐ | |
| 3 | Buka order meja untuk mulai proses pembayaran | ☐ | |
| 4 | Proses pembayaran cash dengan uang pas | ☐ | |
| 5 | Proses pembayaran cash dengan kembalian — verifikasi jumlah kembalian benar secara manual (hitung sendiri, bandingkan) | ☐ | |
| 6 | Cek status meja otomatis kembali "kosong" setelah bayar | ☐ | |
| 7 | Buat order walk-in baru (pelanggan langsung ke kasir, tanpa meja) | ☐ | |
| 8 | Lihat riwayat transaksi hari ini | ☐ | |
| 9 | Tandai 1 menu sebagai "habis", cek apakah pelayan lain langsung melihat perubahan itu | ☐ | |

## Sesi 3 — Peran Owner (durasi ~15 menit)

| # | Skenario | Berhasil? | Catatan |
|---|----------|-----------|---------|
| 1 | Login sebagai Owner, lihat Dashboard | ☐ | |
| 2 | Verifikasi angka pendapatan hari ini sesuai dengan transaksi yang baru diproses di Sesi 2 | ☐ | |
| 3 | Tambah 1 user kasir/pelayan baru | ☐ | |
| 4 | Tambah 1 menu item baru lengkap dengan harga | ☐ | |
| 5 | Lihat laporan menu terlaris | ☐ | |

## Catatan Umum Setelah UAT
- [ ] Kumpulkan feedback subjektif staf: bagian mana yang membingungkan?
- [ ] Catat semua bug yang ditemukan (langkah reproduksi, screenshot jika bisa)
- [ ] Catat kebutuhan tambahan yang muncul saat pemakaian nyata (belum tentu ada di PRD)

---

**Status:** Belum dilaksanakan — menunggu aplikasi berjalan di lingkungan staging/lokal dan jadwal dengan staf restoran.
