const API_URLS = {
  booking: import.meta.env.VITE_BOOKING_API_URL || 'http://localhost:8081/api',
  provider: import.meta.env.VITE_PROVIDER_API_URL || 'http://localhost:8082/api',
  notification: import.meta.env.VITE_NOTIFICATION_API_URL || 'http://localhost:8083/api',
};

export async function apiRequest(service, path, options = {}) {
  const response = await fetch(`${API_URLS[service]}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const error = await response.json();
      message = error.message || error.error || Object.values(error).join(', ') || message;
    } catch { /* use HTTP fallback */ }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function normalizeEnum(value) {
  if (!value) return value;
  return String(value).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
