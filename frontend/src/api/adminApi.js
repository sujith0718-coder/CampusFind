import axios from 'axios';

const TOKEN_KEY = 'campus_find_admin_token';
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Shared authenticated Axios instance for Admin endpoints
 */
export const adminApiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Token management functions
 */
export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function setAdminToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    console.error('Failed to save token to localStorage');
  }
}

export function removeAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to remove token from localStorage');
  }
}

export function isAuthenticated() {
  const token = getAdminToken();
  return Boolean(token && token.trim().length > 0);
}

// Request interceptor: Attach Authorization Bearer token if present
adminApiClient.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: On 401 Unauthorized, purge invalid/expired token
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeAdminToken();
      // Only redirect if current path is in admin area and not already on login
      if (
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Admin Login API
 * POST /api/admin/login
 */
export async function adminLogin(username, password) {
  const response = await adminApiClient.post('/api/admin/login', {
    username,
    password,
  });

  if (response.data?.token) {
    setAdminToken(response.data.token);
  }
  return response.data;
}

/**
 * Fetch Active Lost Reports
 * GET /api/admin/lost-reports
 */
export async function getActiveLostReports() {
  const response = await adminApiClient.get('/api/admin/lost-reports');
  return response.data;
}

/**
 * Fetch Pending Found Queries
 * GET /api/admin/found-queries
 */
export async function getPendingFoundQueries() {
  const response = await adminApiClient.get('/api/admin/found-queries');
  return response.data;
}

/**
 * Resolve Match
 * POST /api/admin/resolve
 */
export async function resolveMatch(lostReportId, foundQueryId, resolvedCategory) {
  const response = await adminApiClient.post('/api/admin/resolve', {
    lostReportId,
    foundQueryId,
    resolvedCategory,
  });
  return response.data;
}

/**
 * Fetch Anonymized Admin Metrics
 * GET /api/admin/metrics
 */
export async function getAdminMetrics() {
  const response = await adminApiClient.get('/api/admin/metrics');
  return response.data;
}

/**
 * Admin Logout
 */
export function adminLogout() {
  removeAdminToken();
}
