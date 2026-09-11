import { apiRequest } from './api';

const SESSION_KEY = 'homefixr_session';

const customerUser = (data) => ({ ...data, id: data.customerId });
const providerUser = (data) => ({
  ...data,
  id: data.providerId,
  businessName: `${data.firstName} ${data.lastName}`,
  available: String(data.availability).toLowerCase() === 'available',
});

function saveSession(role, user) {
  const session = { role, user };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signupCustomer(payload) {
  const data = await apiRequest('booking', '/customers/register', { method: 'POST', body: JSON.stringify(payload) });
  return saveSession('Customer', customerUser(data));
}

export async function signupProvider(payload) {
  const data = await apiRequest('provider', '/providers', {
    method: 'POST', body: JSON.stringify({ ...payload, categoryId: Number(payload.categoryId), experienceYears: 0 }),
  });
  return saveSession('Provider', providerUser(data));
}

export async function loginCustomer(credentials) {
  const data = await apiRequest('booking', '/customers/login', { method: 'POST', body: JSON.stringify(credentials) });
  return saveSession('Customer', customerUser(data));
}

export async function loginProvider(credentials) {
  const data = await apiRequest('provider', '/providers/login', { method: 'POST', body: JSON.stringify(credentials) });
  return saveSession('Provider', providerUser(data));
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

export function getToken() { return null; }
export function updateSession(session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
export function logout() { localStorage.removeItem(SESSION_KEY); }
