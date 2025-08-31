// src/auth.js
export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
  // let the app know auth changed (Navbar listens for this)
  window.dispatchEvent(new Event('auth'));
}

export function clearToken() {
  localStorage.removeItem('token');
  window.dispatchEvent(new Event('auth'));
}
