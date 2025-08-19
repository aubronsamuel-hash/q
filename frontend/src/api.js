// Centralized API base URL
// Uses REACT_APP_API_URL defined at build time
export const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Helper around fetch that adds the Authorization header when a token is provided.
 * @param {string} path Relative API path starting with '/'
 * @param {object} options Fetch options
 * @param {string} token JWT token
 */
export async function apiFetch(path, options = {}, token) {
  const headers = options.headers ? { ...options.headers } : {};
  if (token) {
    // Include bearer token for authenticated requests
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}
