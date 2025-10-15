const TOKEN_KEY = 'dkp_token';
const USER_KEY = 'dkp_user';

export function setToken(token: string, remember = false, user?: unknown) {
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch {
    // ignore storage errors
  }
}

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function getUser() {
  try {
    const str = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

const auth = { setToken, getToken, clearToken, isAuthenticated, getUser };

export default auth;
