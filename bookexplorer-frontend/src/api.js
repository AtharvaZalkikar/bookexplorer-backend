// src/api.js
import axios from 'axios';
import { getToken, clearToken } from './auth';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // root now, not just /api/
});

// Attach token from localStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// If backend says 401, clear token and (optionally) redirect to /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      clearToken();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(err);
  }
);

// src/api.js (add this at bottom before export default)
export const searchBooks = (title) => {
  return api.get(`/api/search-open/?title=${encodeURIComponent(title)}`);
};


// Save book to backend
export async function saveBookFromSearch(book) {
  const response = await fetch("/api/save-from-search/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error("Failed to save book");
  }
  return response.json();
}


export default api;
