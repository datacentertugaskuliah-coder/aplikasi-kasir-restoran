import { useState } from 'react';
import LoginPage from '../pages/LoginPage';
import Navigation from './Navigation';
import { setSession, getSession, clearSession } from '../services/sessionStore';
import { logout as logoutRequest } from '../services/authService';

// Komponen pembungkus utama: mengatur state login/logout + navigasi role-based di level aplikasi.
export default function AppShell({ pages }) {
  const [session, setSessionState] = useState(getSession());
  const [activePage, setActivePage] = useState(null);

  function handleLoginSuccess(data) {
    setSession(data);
    setSessionState(data);
    setActivePage(data.user.role === 'owner' ? 'dashboard' : 'tables');
  }

  async function handleLogout() {
    if (session) await logoutRequest(session.token);
    clearSession();
    setSessionState(null);
    setActivePage(null);
  }

  if (!session) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const PageComponent = pages[activePage];

  return (
    <div>
      <header className="app-header">
        <span>{session.user.fullName} ({session.user.role})</span>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <Navigation role={session.user.role} activePage={activePage} onNavigate={setActivePage} />
      <main>{PageComponent ? <PageComponent /> : <p>Pilih menu di atas</p>}</main>
    </div>
  );
}
