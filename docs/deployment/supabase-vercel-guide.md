# Panduan Deploy: Supabase (Database) + Vercel (Backend & Frontend)

**Status: Belum dieksekusi.** Panduan ini perlu Anda jalankan sendiri karena memerlukan akun
Supabase dan Vercel milik Anda — saya tidak punya akses untuk membuatnya untuk Anda.

Kedua layanan ini punya **free tier** yang cukup untuk uji coba single-outlet restaurant.

---

## Bagian 1: Setup Database di Supabase

1. Daftar/login di **supabase.com** (gratis, bisa pakai akun GitHub)
2. Klik **"New Project"** — beri nama misal `kasir-restoran`, pilih region terdekat (Singapore biasanya paling dekat ke Indonesia), buat password database (simpan baik-baik)
3. Tunggu ~2 menit sampai project selesai dibuat
4. Buka menu **SQL Editor** di sidebar kiri
5. Jalankan **satu per satu**, isi query dari file migration secara berurutan (copy-paste isi file, klik Run):
   - `backend/src/migrations/001_create_users_roles.sql`
   - `backend/src/migrations/002_create_menu_tables.sql`
   - `backend/src/migrations/003_create_tables_orders.sql`
   - `backend/src/migrations/004_create_transactions.sql`
   - `backend/src/migrations/005_create_stock.sql`
6. Buka menu **Project Settings → Database**, cari bagian **Connection String**
7. Pilih tab **"Transaction"** mode (bukan "Session") — ini pooler khusus untuk aplikasi serverless seperti Vercel, port biasanya `6543`
8. Copy connection string tersebut, akan dipakai sebagai `DATABASE_URL` di Vercel nanti

**Catatan penting:** Serverless function (Vercel) membuka & menutup koneksi database dengan cepat berkali-kali. Memakai "Transaction pooler" Supabase (bukan direct connection) mencegah error "too many connections".

---

## Bagian 2: Deploy Backend ke Vercel

1. Daftar/login di **vercel.com** (gratis, bisa pakai akun GitHub — sambungkan ke akun GitHub `datacentertugaskuliah-coder`)
2. Klik **"Add New" → "Project"**, pilih repo `aplikasi-kasir-restoran`
3. Di pengaturan **"Root Directory"**, pilih folder `backend` (karena repo berisi backend+frontend dalam satu repo)
4. Di bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL` = connection string dari Supabase (Bagian 1 langkah 7)
   - `JWT_SECRET` = string acak unik, rahasia (bukan yang di `.env.example`)
   - `JWT_EXPIRES_IN` = `8h`
5. Klik **Deploy**
6. Setelah selesai, Vercel memberi URL, misal `https://kasir-restoran-backend.vercel.app`
7. Tes: buka `https://kasir-restoran-backend.vercel.app/api/health` di browser, harus muncul `{"status":"ok"}`

---

## Bagian 3: Deploy Frontend ke Vercel

1. Di Vercel, klik **"Add New" → "Project"** lagi, pilih repo yang sama
2. Kali ini **Root Directory** pilih folder `frontend`
3. Di **Environment Variables**, tambahkan:
   - `VITE_API_BASE_URL` = URL backend dari Bagian 2 + `/api`, contoh: `https://kasir-restoran-backend.vercel.app/api`
4. Klik **Deploy**
5. Setelah selesai, Vercel memberi URL frontend, misal `https://kasir-restoran.vercel.app` — **inilah link yang dibuka dari tablet restoran**

---

## Bagian 4: Buat Akun Owner Pertama

1. Kembali ke Supabase **SQL Editor**
2. Generate password hash dulu — di Mac Anda, Terminal:
   ```
   cd ~/Documents/GitHub/aplikasi-kasir-restoran/aplikasi-kasir-restoran/backend
   node -e "console.log(require('bcryptjs').hashSync('password_anda', 10))"
   ```
   (perlu `npm install` dulu di folder backend jika belum)
3. Copy hasil hash-nya, jalankan query di Supabase SQL Editor (isi dari `docs/deployment/seed-initial-owner.sql`, ganti `<PASTE_BCRYPT_HASH_DI_SINI>` dengan hash tadi)
4. Buka frontend URL dari Bagian 3, login dengan username & password Owner yang baru dibuat

---

## Checklist Verifikasi
- [ ] Migration 001-005 berhasil dijalankan di Supabase tanpa error
- [ ] `GET /api/health` di backend Vercel mengembalikan status ok
- [ ] Frontend Vercel bisa dibuka dan menampilkan halaman login
- [ ] Login dengan akun Owner berhasil
- [ ] Coba 1 alur sederhana: buat order, bayar, cek muncul di riwayat transaksi

## Batasan Free Tier (perlu diketahui)
- **Supabase free**: project di-pause otomatis jika tidak ada aktivitas 7 hari (tinggal klik "resume" saat dipakai lagi)
- **Vercel free**: cukup generous untuk trafik kecil single-outlet, serverless function ada batas durasi eksekusi (~10 detik per request, harusnya cukup untuk API sederhana ini)
