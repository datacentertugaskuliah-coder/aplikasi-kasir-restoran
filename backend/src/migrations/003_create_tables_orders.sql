-- Migration: Buat tabel tables, orders, order_items
-- Sesuai PRD: alur order kombinasi kasir (walk-in) + pelayan (dine-in per meja)

CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    table_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'empty' -- 'empty' | 'occupied' | 'awaiting_payment'
        CHECK (status IN ('empty', 'occupied', 'awaiting_payment')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables(id), -- NULL untuk order walk-in tanpa meja
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine_in', 'walk_in')),
    status VARCHAR(20) DEFAULT 'open'
        CHECK (status IN ('open', 'awaiting_payment', 'paid', 'cancelled')),
    opened_by_user_id INTEGER REFERENCES users(id), -- kasir atau pelayan yang membuka order
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    bundle_id INTEGER REFERENCES bundles(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL, -- disalin saat order dibuat (jaga histori harga)
    note TEXT, -- catatan khusus per item, misal "tidak pedas"
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (
        (menu_item_id IS NOT NULL AND bundle_id IS NULL) OR
        (menu_item_id IS NULL AND bundle_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
