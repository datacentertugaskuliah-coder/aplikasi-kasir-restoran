-- Migration: Buat tabel transactions dan transaction_items
-- Transaksi adalah snapshot final dari sebuah order yang sudah dibayar.
-- Dipisah dari `orders` agar riwayat finansial tetap akurat walau data order/menu berubah.

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    cashier_id INTEGER NOT NULL REFERENCES users(id), -- kasir yang memproses pembayaran
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    total NUMERIC(12,2) NOT NULL CHECK (total >= 0), -- subtotal + pajak/service charge (Fase berikutnya)
    amount_paid NUMERIC(12,2) NOT NULL CHECK (amount_paid >= 0),
    change_amount NUMERIC(12,2) NOT NULL CHECK (change_amount >= 0),
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method = 'cash'), -- cash-only Fase 1
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_cashier ON transactions(cashier_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Snapshot item-item yang dibeli, disalin dari order_items saat transaksi dibuat
CREATE TABLE IF NOT EXISTS transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL, -- disalin sebagai teks agar tidak bergantung ke menu_items
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL,
    line_total NUMERIC(12,2) NOT NULL,
    note TEXT
);

CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON transaction_items(transaction_id);
