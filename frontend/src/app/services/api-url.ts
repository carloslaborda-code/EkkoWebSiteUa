const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

const runtimeApiBaseUrl =
  typeof window !== 'undefined'
    ? ((window as Window & { __EKKO_CONFIG__?: { apiBaseUrl?: string } }).__EKKO_CONFIG__?.apiBaseUrl || '')
        .trim()
        .replace(/\/+$/, '')
    : '';

const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

export const API_BASE_URL =
  runtimeApiBaseUrl ||
  (isLocalHost
    ? `${protocol}//${hostname}:5000/api`
    : '/api');
