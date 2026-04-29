const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const API_BASE_URL = `${protocol}//${hostname}:5000/api`;
