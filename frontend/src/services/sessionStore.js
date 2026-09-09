// Session/token handling di sisi frontend.
// Token disimpan di memory (module-level state), BUKAN localStorage, untuk mengurangi
// risiko XSS mengakses token. Konsekuensinya: refresh halaman = perlu login ulang
// (acceptable untuk device kasir/pelayan yang biasanya dibiarkan terbuka).

let currentSession = null; // { token, user }

export function setSession(session) {
  currentSession = session;
}

export function getSession() {
  return currentSession;
}

export function clearSession() {
  currentSession = null;
}

export function getToken() {
  return currentSession ? currentSession.token : null;
}

export function getCurrentUser() {
  return currentSession ? currentSession.user : null;
}
