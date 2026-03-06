const API_BASE_URL = 'http://localhost:8000/auth';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Enhanced fetch with automatic token refresh.
 * @param {string} url - endpoint (relative or absolute)
 * @param {object} options - fetch options
 * @returns {Promise} - fetch response
 */
export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem('access_token');

  // Attach token to request
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  // Helper to refresh token
  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const response = await fetch(`${API_BASE_URL}/jwt/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      // Refresh failed – clear tokens and reject
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    // If backend returns new refresh token (optional), store it
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    return data.access;
  };

  // Make the request
  let response = await fetch(url, authOptions);

  // If 401, try to refresh token
  if (response.status === 401) {
    if (isRefreshing) {
      // Wait for the ongoing refresh to finish
      const newToken = await new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      // Retry original request with new token
      authOptions.headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, authOptions);
    } else {
      isRefreshing = true;
      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        // Retry original request
        authOptions.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, authOptions);
      } catch (err) {
        processQueue(err, null);
        // Redirect to login (can be handled by component)
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
  }

  return response;
};