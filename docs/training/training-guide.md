# Panduan Training Singkat — Kasir & Pelayan

**Status: Belum dilaksanakan.** Materi ini disiapkan sebagai panduan; pelaksanaan sungguhan
memerlukan aplikasi sudah live (staging/production) dan sesi tatap muka dengan staf.

**Durasi estimasi:** 30-45 menit per role, bisa digabung dengan sesi UAT (`docs/testing/uat-script.md`).

---

## Training untuk Pelayan (Fokus: Input Order)

### Materi
1. **Login** — cara masuk pakai username/password yang diberikan Owner
2. **Melihat status meja** — warna/label menandakan meja kosong, terisi, atau menunggu bayar
3. **Membuka order baru** — tap meja yang akan diisi pelanggan
4. **Menambah item ke order:**
   - Pilih dari grid menu (kategori tersusun rapi)
   - Untuk paket/bundling: sama seperti memilih menu biasa, harga otomatis sesuai paket
   - Menambahkan catatan khusus (misal "tidak pedas") — tunjukkan cara mengisi kolom catatan
5. **Mengubah pesanan** — cara edit jumlah atau hapus item sebelum pelanggan bayar
6. **Menandai menu habis** — jika bahan di dapur habis, pelayan bisa langsung update dari tablet
7. **Logout** — penting dilakukan jika tablet dipakai bergantian

### Poin Penting yang Sering Jadi Kesalahan
- Order yang sudah dibuka Kasir untuk pembayaran (status "menunggu bayar") tidak bisa lagi diedit pelayan — jelaskan alasan ini agar tidak bingung
- Pastikan pilih meja yang benar sebelum menambah item (hindari salah kirim order ke meja lain)

---

## Training untuk Kasir (Fokus: Pembayaran & Transaksi)

### Materi
1. **Login** sebagai Kasir
2. **Melihat order masuk** — order dari pelayan otomatis muncul di sistem tanpa perlu refresh manual
3. **Membuka order untuk pembayaran** — tap meja yang pelanggannya siap bayar
4. **Memproses pembayaran cash:**
   - Masukkan jumlah uang yang diterima
   - Sistem otomatis menghitung kembalian — **selalu cek ulang secara manual di awal-awal pemakaian** sampai terbiasa percaya sistem
5. **Order walk-in** — cara input pesanan untuk pelanggan yang langsung ke kasir (tanpa lewat pelayan)
6. **Riwayat transaksi** — cara melihat transaksi hari ini jika perlu cek ulang
7. **Update stok** — cara input stok masuk (restock) atau koreksi jumlah stok

### Poin Penting yang Sering Jadi Kesalahan
- Pastikan pilih order/meja yang benar sebelum memproses pembayaran — tidak ada tombol "undo" otomatis setelah transaksi tercatat
- Jika pelanggan komplain jumlah kembalian, tunjukkan cara membuka detail transaksi terakhir untuk verifikasi

---

## Setelah Training
- [ ] Kumpulkan pertanyaan/kebingungan staf selama sesi, catat untuk perbaikan UI jika perlu
- [ ] Sediakan kontak (Owner atau developer) untuk staf hubungi jika menemui masalah di hari-hari pertama pemakaian nyata
- [ ] Jadwalkan sesi check-in singkat setelah 3-7 hari pemakaian untuk evaluasi
