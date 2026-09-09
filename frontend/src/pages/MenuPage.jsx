import { useEffect, useState } from 'react';
import { fetchMenuItems, fetchBundles, toggleAvailability } from '../services/menuService';

// Halaman grid menu — dipakai saat input order oleh Kasir/Pelayan.
// Layout grid besar & touch-friendly untuk tablet.
export default function MenuPage({ onSelectItem }) {
  const [items, setItems] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMenuItems(), fetchBundles()])
      .then(([menuItems, bundleList]) => {
        setItems(menuItems);
        setBundles(bundleList);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(id, current, type) {
    await toggleAvailability(id, !current, type);
    if (type === 'menu-items') {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_available: !current } : i)));
    } else {
      setBundles((prev) => prev.map((b) => (b.id === id ? { ...b, is_available: !current } : b)));
    }
  }

  if (loading) return <p>Memuat menu...</p>;

  return (
    <div className="menu-page">
      <h2>Menu</h2>
      <div className="menu-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`menu-card ${!item.is_available ? 'unavailable' : ''}`}
            onClick={() => item.is_available && onSelectItem?.(item)}
          >
            <h3>{item.name}</h3>
            <p>Rp {Number(item.price).toLocaleString('id-ID')}</p>
            {!item.is_available && <span className="badge">Habis</span>}
            <button onClick={(e) => { e.stopPropagation(); handleToggle(item.id, item.is_available, 'menu-items'); }}>
              {item.is_available ? 'Tandai Habis' : 'Tandai Tersedia'}
            </button>
          </div>
        ))}
      </div>

      <h2>Paket</h2>
      <div className="menu-grid">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className={`menu-card bundle ${!bundle.is_available ? 'unavailable' : ''}`}
            onClick={() => bundle.is_available && onSelectItem?.(bundle, true)}
          >
            <h3>{bundle.name}</h3>
            <p>Rp {Number(bundle.bundle_price).toLocaleString('id-ID')}</p>
            {!bundle.is_available && <span className="badge">Habis</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
