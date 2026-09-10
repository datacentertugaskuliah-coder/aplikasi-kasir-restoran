import AppShell from './components/AppShell';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import './styles/tokens.css';
import './styles/layout.css';

// Pemetaan key navigasi -> komponen halaman.
// Halaman 'tables', 'walk-in', 'users', 'stock', 'reports' menyusul di iterasi berikutnya
// (struktur sudah disiapkan di Navigation.jsx, tinggal isi komponennya).
const pages = {
  dashboard: DashboardPage,
  menu: MenuPage,
  'menu-management': MenuPage,
  transactions: TransactionHistoryPage,
};

export default function App() {
  return <AppShell pages={pages} />;
}
