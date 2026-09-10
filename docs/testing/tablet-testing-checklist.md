# Checklist Testing UI/UX Tablet

Checklist ini untuk memverifikasi tampilan & interaksi aplikasi di perangkat tablet nyata.
**Catatan:** checklist ini perlu dieksekusi manual oleh tim di perangkat fisik — belum bisa diverifikasi otomatis dari lingkungan development.

## Perangkat & Ukuran Target
- [ ] iPad (9th/10th gen) — 810 x 1080px portrait, 1080 x 810px landscape
- [ ] iPad Air/Pro — 820-1024px lebar
- [ ] Android tablet umum (Samsung Galaxy Tab) — 800-1200px lebar
- [ ] Browser: Safari (iOS) dan Chrome (Android) minimal

## Area Sentuh (Touch Target)
- [ ] Semua tombol dapat ditekan dengan mudah menggunakan jari (minimal 44x44px)
- [ ] Tidak ada tombol yang terlalu berdekatan sehingga salah tekan
- [ ] Tombol "Tandai Habis/Tersedia" pada menu card mudah dijangkau tanpa salah pilih item

## Layout & Responsivitas
- [ ] Grid menu menyesuaikan dengan baik di mode portrait dan landscape
- [ ] Header tidak terpotong atau tumpang tindih di layar sempit
- [ ] Dashboard Owner (summary cards) tersusun rapi di berbagai ukuran layar
- [ ] Tabel riwayat transaksi dapat di-scroll horizontal jika kolom terlalu lebar

## Navigasi Role-Based
- [ ] Kasir hanya melihat menu: Meja, Order Walk-in, Riwayat Transaksi, Stok
- [ ] Pelayan hanya melihat menu: Meja, Menu
- [ ] Owner melihat semua menu termasuk Dashboard, Kelola Menu, Kelola User, Laporan

## Interaksi & Feedback
- [ ] Loading state muncul jelas saat data sedang dimuat (tidak ada layar kosong tanpa indikasi)
- [ ] Pesan error tampil jelas dan mudah dibaca saat login gagal / aksi gagal
- [ ] Badge "Habis" pada menu terlihat jelas kontras dengan latar

## Performa
- [ ] Aplikasi tetap responsif saat polling order aktif berjalan di background
- [ ] Tidak ada lag terasa saat berpindah antar halaman navigasi

---

**Status:** Belum dieksekusi — menunggu build aplikasi berjalan penuh (memerlukan backend + database aktif) dan akses ke perangkat tablet fisik.
