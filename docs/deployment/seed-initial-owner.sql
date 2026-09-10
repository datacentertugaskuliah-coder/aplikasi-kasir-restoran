-- Seed akun Owner pertama — dijalankan manual sekali setelah migration selesai,
-- baik di staging maupun production (isi password_hash berbeda untuk masing-masing!).
--
-- Cara generate password_hash: gunakan bcrypt di Node.js, contoh:
--   node -e "console.log(require('bcryptjs').hashSync('password_anda', 10))"
-- Copy hasilnya ke query di bawah, JANGAN commit hash sungguhan ke Git.

INSERT INTO users (full_name, username, password_hash, role_id)
SELECT 'Nama Owner', 'owner_username', '<PASTE_BCRYPT_HASH_DI_SINI>', id
FROM roles WHERE name = 'owner';
