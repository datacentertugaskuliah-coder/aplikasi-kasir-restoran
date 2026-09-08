# Product Requirement Document (PRD)
## Aplikasi Kasir (POS) Restoran

**Versi:** 1.0
**Tanggal:** 7 September 2026
**Status:** Draft

---

## 1. Latar Belakang & Tujuan

Restoran (single outlet) membutuhkan aplikasi kasir berbasis **web app** yang dioperasikan melalui **tablet**, untuk mendukung alur order kombinasi antara kasir (walk-in customer langsung ke kasir) dan pelayan (input order via tablet ke meja pelanggan dine-in).

**Tujuan produk:**
- Mempercepat proses input order dan transaksi pembayaran
- Mengurangi kesalahan pencatatan pesanan (miss order, salah menu)
- Memberikan visibilitas laporan penjualan bagi owner
- Mendukung manajemen menu termasuk paket/bundling
- Menjadi fondasi sistem yang bisa dikembangkan (multi-outlet, payment digital, integrasi dapur) di fase berikutnya

---

## 2. Target Pengguna & Role

| Role | Deskripsi | Akses Utama |
|---|---|---|
| **Kasir** | Menerima pembayaran, input order walk-in, cetak/lihat struk | Order, Payment, Riwayat transaksi harian |
| **Pelayan** | Input order dari meja pelanggan via tablet | Order per meja, kirim ke kasir/dapur |
| **Owner** | Pemilik restoran, memantau bisnis | Semua akses + Laporan penjualan + Manajemen menu & user |

Catatan: akses laporan owner cukup diakses **dari dalam restoran** (tidak perlu remote access di fase awal).

---

## 3. Platform & Perangkat

- **Platform:** Web application (dapat diakses via browser)
- **Device:** Tablet (optimasi tampilan untuk layar tablet, responsif)
- **Koneksi:** Asumsi menggunakan jaringan lokal/internet restoran (perlu klarifikasi lebih lanjut apakah wajib online atau perlu mode offline — lihat bagian Open Questions)
- **Tidak ada integrasi eksternal** di fase awal (tanpa printer, tanpa payment gateway, tanpa accounting/pajak, tanpa online order platform)

---

## 4. Alur Penggunaan Utama (User Flow)

### 4.1 Alur Dine-in (via Pelayan)
1. Pelanggan duduk di meja
2. Pelayan membuka tablet, memilih nomor meja
3. Pelayan input pesanan (menu, varian/paket, jumlah)
4. Order tersimpan dan terhubung ke meja tersebut
5. Order dapat ditambah/diubah selama pelanggan masih di meja
6. Saat pelanggan selesai, kasir membuka meja tsb untuk proses pembayaran
7. Kasir menerima pembayaran cash, transaksi selesai, meja berstatus kosong kembali

### 4.2 Alur Walk-in (langsung ke Kasir)
1. Pelanggan datang langsung ke kasir
2. Kasir input pesanan
3. Kasir proses pembayaran cash
4. Transaksi selesai, struk dapat dilihat/dicetak (jika ada printer — lihat Open Questions)

---

## 5. Fitur & Requirement

### 5.1 Manajemen Menu (Prioritas Tinggi)
- CRUD kategori menu
- CRUD item menu (nama, harga, deskripsi, foto opsional, status aktif/nonaktif)
- **Paket/Bundling menu**: kombinasi beberapa item dengan harga khusus paket
- Menu dapat diatur ketersediaannya (habis/tersedia) secara real-time oleh kasir/pelayan

### 5.2 Manajemen Meja & Order (Prioritas Tinggi)
- Daftar meja dengan status (kosong/terisi/menunggu pembayaran)
- Pelayan dapat membuka order baru per meja
- Tambah/edit/hapus item dalam order sebelum dibayar
- Order per meja dapat dilihat oleh kasir untuk proses pembayaran
- Catatan khusus per item (misal: "tidak pedas", "extra saus")

### 5.3 Transaksi & Pembayaran (Prioritas Tinggi)
- Pembayaran cash (fase awal)
- Kalkulasi kembalian otomatis
- Diskon per transaksi (opsional, perlu klarifikasi apakah dibutuhkan)
- Pajak/service charge (opsional, perlu klarifikasi persentase & aturan)
- Riwayat transaksi harian

### 5.4 Manajemen User & Role (Prioritas Tinggi)
- Login per role (Kasir, Pelayan, Owner)
- Owner dapat menambah/menghapus/mengatur akun kasir & pelayan
- Setiap transaksi tercatat siapa kasir yang memproses

### 5.5 Laporan & Analitik (Prioritas Tinggi — diakses Owner)
- Laporan penjualan harian/mingguan/bulanan
- Menu terlaris
- Total transaksi per kasir
- Ringkasan pendapatan (akses dari dalam restoran)

### 5.6 Manajemen Stok/Inventory (Prioritas Tinggi)
- Pencatatan stok bahan baku atau stok menu (perlu klarifikasi: stok per menu jadi, atau stok bahan baku/resep)
- Notifikasi stok menipis/habis
- Menu otomatis nonaktif jika stok habis (opsional)

---

## 6. Kebutuhan Non-Fungsional

- **Usability:** Antarmuka sederhana, mudah dipakai kasir/pelayan tanpa training lama, optimal untuk layar tablet (touch-friendly)
- **Reliability:** Data order tidak boleh hilang saat berpindah antar device (kasir–pelayan)
- **Security:** Login per role, hak akses berbeda per role
- **Performance:** Input order dan proses pembayaran harus cepat (idealnya <2 detik response)
- **Skalabilitas:** Arsitektur sebaiknya mendukung penambahan cabang/fitur online payment di masa depan meski tidak dibutuhkan sekarang

---

## 7. Di Luar Cakupan (Out of Scope) — Fase 1

- Pembayaran non-cash (kartu, QRIS, e-wallet)
- Integrasi printer struk/dapur
- Integrasi accounting/pajak (e-Faktur, dsb)
- Integrasi platform online order (GoFood, GrabFood, dsb)
- Multi-outlet/multi-cabang
- Akses laporan remote (di luar restoran)
- Self-order oleh pelanggan (QR/kiosk)

---

## 8. Open Questions (Perlu Klarifikasi Lebih Lanjut)

Beberapa hal berikut masih perlu didiskusikan lebih lanjut sebelum masuk tahap desain teknis:

1. **Mode koneksi:** Apakah aplikasi wajib online (butuh internet stabil), atau perlu tetap berjalan saat koneksi terputus (offline-first)?
2. **Cetak struk:** Apakah tetap butuh cetak struk fisik meski tanpa printer khusus (misal print via browser ke printer biasa), atau cukup struk digital?
3. **Split bill:** Meski metode bayar cash saja, apakah tetap perlu fitur split bill (1 meja bayar terpisah per orang)?
4. **Diskon & pajak/service charge:** Apakah restoran menerapkan pajak (PB1) atau service charge? Berapa persentasenya?
5. **Manajemen stok:** Apakah stok dihitung per menu jadi (misal "Nasi Goreng: 20 porsi tersisa") atau per bahan baku dengan resep (misal 1 Nasi Goreng = 200gr beras + ...)?
6. **Jumlah meja:** Berapa perkiraan jumlah meja yang perlu dikelola dalam sistem?
7. **Void/pembatalan order:** Siapa yang berwenang membatalkan/mengubah order yang sudah masuk kasir (kasir saja, atau perlu approval owner)?
8. **Shift kasir:** Apakah perlu sistem buka/tutup kasir per shift dengan rekonsiliasi kas (cash drawer reconciliation)?

---

## 9. Kriteria Sukses (Success Metrics)

- Waktu rata-rata input order berkurang dibanding proses manual (target: <1 menit per order)
- Tidak ada selisih laporan kas harian vs transaksi tercatat sistem
- Owner dapat melihat laporan penjualan tanpa bantuan pihak lain
- Adopsi 100% oleh kasir & pelayan dalam 2 minggu setelah peluncuran

---

## 10. Roadmap Singkat (Usulan)

| Fase | Cakupan |
|---|---|
| **Fase 1 (MVP)** | Menu (termasuk paket), Order via kasir & pelayan, Manajemen meja, Pembayaran cash, Role user, Laporan dasar, Manajemen stok dasar |
| **Fase 2** | Metode pembayaran digital (QRIS/e-wallet), Integrasi printer struk/dapur |
| **Fase 3** | Multi-outlet, Akses laporan remote, Integrasi accounting |
| **Fase 4** | Self-order QR/kiosk, Integrasi online order platform |

---

*Dokumen ini adalah draft awal berdasarkan hasil wawancara kebutuhan. Bagian "Open Questions" perlu dijawab untuk memastikan spesifikasi teknis final sebelum masuk ke tahap desain/development.*
