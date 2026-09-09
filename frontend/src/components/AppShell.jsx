import { useState } from 'react';
import LoginPage from '../pages/LoginPage';
import { setSession, getSession, clearSession } from '../services/sessionStore';
import { logout as logoutRequest } from '../services/authService';

// Komponen pembungkus utama: mengatur state login/logout di level aplikasi.
export default function AppShell({ children }) {
  const [session, setSessionState] = useState(getSession());

  function handleLoginSuccess(data) {
    setSession(data);
    setSessionState(data);
  }

  async function handleLogout() {
    if (session) await logoutRequest(session.token);
    clearSession();
    setSessionState(null);
  }

  if (!session) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <header className="app-header">
        <span>{session.user.fullName} ({session.user.role})</span>
        <button onClick={handleLogout}>Logout</button>
      </header>
      {children}
    </div>
  );
}
