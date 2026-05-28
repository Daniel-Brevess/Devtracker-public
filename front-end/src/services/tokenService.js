const TOKEN_KEY = "token";
const USER_KEY = "devtrack_user";

function decodeTokenPayload(token) {
  try {
    const [, payload] = token.split(".");
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = atob(normalizedPayload);

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token = getToken()) {
  if (!token) {
    return true;
  }

  const payload = decodeTokenPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token && isTokenExpired(token)) {
    logout();
    return null;
  }

  return token;
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const user = localStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export function logout() {
  removeToken();
  removeUser();
}

export function isAuthenticated() {
  return Boolean(getToken());
}
