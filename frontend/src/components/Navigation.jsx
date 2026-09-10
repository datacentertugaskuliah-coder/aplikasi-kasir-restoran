// Navigasi role-based — menu yang tampil berbeda untuk Kasir/Pelayan/Owner.
// Konfigurasi menu per role didefinisikan di satu tempat agar mudah di-maintain.

const NAV_ITEMS_BY_ROLE = {
  kasir: [
    { key: 'tables', label: 'Meja' },
    { key: 'walk-in', label: 'Order Walk-in' },
    { key: 'transactions', label: 'Riwayat Transaksi' },
    { key: 'stock', label: 'Stok' },
  ],
  pelayan: [
    { key: 'tables', label: 'Meja' },
    { key: 'menu', label: 'Menu' },
  ],
  owner: [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'tables', label: 'Meja' },
    { key: 'menu-management', label: 'Kelola Menu' },
    { key: 'users', label: 'Kelola User' },
    { key: 'stock', label: 'Stok' },
    { key: 'reports', label: 'Laporan' },
    { key: 'transactions', label: 'Riwayat Transaksi' },
  ],
};

export default function Navigation({ role, activePage, onNavigate }) {
  const items = NAV_ITEMS_BY_ROLE[role] || [];

  return (
    <nav className="app-nav">
      {items.map((item) => (
        <button
          key={item.key}
          className={activePage === item.key ? 'nav-item active' : 'nav-item'}
          onClick={() => onNavigate(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
