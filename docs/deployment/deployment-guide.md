# Panduan Deployment

**Status: Belum dieksekusi.** Dokumen ini adalah panduan langkah-demi-langkah yang perlu dijalankan
oleh Anda (atau developer yang melanjutkan project ini) — saya (Claude) tidak punya akses ke akun
hosting/domain untuk melakukan deployment sungguhan.

## Opsi Hosting yang Cocok untuk Skala Single-Outlet

| Opsi | Kelebihan | Cocok untuk |
|---|---|---|
| **Railway** / **Render** | Setup cepat, auto-deploy dari GitHub, database included | Staging & production awal, tanpa perlu kelola server |
| **VPS (DigitalOcean, dll) + Docker Compose** | Kontrol penuh, biaya lebih murah jangka panjang | Setelah traffic stabil, butuh kontrol lebih |
| **Vercel (frontend) + Railway (backend+DB)** | Frontend sangat cepat, split concern | Jika ingin optimasi khusus frontend |

Rekomendasi untuk mulai: **Railway atau Render** — paling sedikit friksi untuk single-outlet restaurant.

---

## Tahap 1: Deploy Staging (Uji Coba Internal)

Tujuan: environment terpisah dari data asli, untuk tim internal menguji sebelum dipakai pelanggan sungguhan.

1. Buat akun di Railway/Render, hubungkan ke repo GitHub `aplikasi-kasir-restoran`
2. Buat service database PostgreSQL baru, catat connection string yang diberikan
3. Jalankan migration SQL (001-005) ke database staging:
   ```
   psql <connection_string> -f backend/src/migrations/001_create_users_roles.sql
   psql <connection_string> -f backend/src/migrations/002_create_menu_tables.sql
   psql <connection_string> -f backend/src/migrations/003_create_tables_orders.sql
   psql <connection_string> -f backend/src/migrations/004_create_transactions.sql
   psql <connection_string> -f backend/src/migrations/005_create_stock.sql
   ```
4. Deploy service backend, set environment variables sesuai `backend/.env.example` (isi dengan nilai staging, JWT_SECRET unik)
5. Deploy service frontend, set `VITE_API_BASE_URL` ke URL backend staging
6. Buat 1 akun Owner awal secara manual di database (lihat query contoh di `docs/deployment/seed-initial-owner.sql`)
7. Login ke staging, verifikasi seluruh alur (lihat `docs/testing/uat-script.md`) berjalan sebelum lanjut ke production

**Checklist staging:**
- [ ] Database staging aktif dan migration berhasil
- [ ] Backend staging dapat diakses (cek `/api/health`)
- [ ] Frontend staging dapat login dan memanggil API backend
- [ ] Minimal 1 alur end-to-end (order → bayar) berhasil dites manual di staging

---

## Tahap 2: Deploy Production

Dilakukan **setelah** staging selesai diverifikasi (checklist di atas semua tercentang) dan UAT (`docs/testing/uat-script.md`) selesai dilaksanakan.

1. Buat service terpisah untuk production (database, backend, frontend baru — jangan reuse staging)
2. Gunakan `JWT_SECRET` yang benar-benar unik dan rahasia (jangan sama dengan staging)
3. Ulangi langkah migration seperti staging, di database production
4. Deploy backend & frontend production
5. Arahkan domain (jika ada) ke frontend production
6. Buat akun Owner asli restoran (bukan akun test)
7. Backup database dijadwalkan (minimal harian) — cek fitur backup otomatis dari provider hosting yang dipilih

**Checklist production:**
- [ ] Domain (jika ada) mengarah dengan benar
- [ ] HTTPS aktif (biasanya otomatis di Railway/Render/Vercel)
- [ ] Akun Owner asli sudah dibuat, akun test dihapus
- [ ] Backup database terjadwal aktif
- [ ] Tim (Kasir/Pelayan) sudah menerima training (lihat `docs/training/training-guide.md`)

---

## Rollback Plan
Jika terjadi masalah setelah deploy production:
1. Providers seperti Railway/Render biasanya menyimpan riwayat deployment — gunakan fitur "rollback to previous deployment"
2. Jika masalah di database (migration gagal), restore dari backup terakhir sebelum migration dijalankan
