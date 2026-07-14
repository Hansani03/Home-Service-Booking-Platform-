// authService.js
// -----------------------------------------------------------------------------
// Talks to the mock DB today. Swap points for the real backend are marked
// with TODO(API). Both Provider (8082) and Booking (8081) microservices
// expose their own register/login endpoints for their respective user type.
// -----------------------------------------------------------------------------
import { getDb, updateDb, delay } from './mockDb';

const SESSION_KEY = 'homefixr_session';
const TOKEN_KEY = 'homefixr_token';

function fakeJwt(payload) {
  // TODO(API): the real backend issues a signed JWT on login/register.
  // This just base64-encodes a payload so the rest of the app can treat
  // "there is a token" the same way it will once the real one arrives.
  return `fake.${btoa(JSON.stringify(payload))}.jwt`;
}

export async function signupCustomer({ firstName, lastName, email, password, phone, address }) {
  // TODO(API): POST http://localhost:8081/api/customers/register
  await delay();
  const db = getDb();
  if (db.customers.some((c) => c.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  const id = Math.max(0, ...db.customers.map((c) => c.id)) + 1;
  const customer = { id, firstName, lastName, email, password, phone, address };
  updateDb((d) => d.customers.push(customer));
  return loginCustomer({ email, password });
}

export async function signupProvider({ firstName, lastName, categoryId, email, password, phone, location }) {
  // TODO(API): POST http://localhost:8082/api/providers
  await delay();
  const db = getDb();
  if (db.providers.some((p) => p.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  const id = Math.max(0, ...db.providers.map((p) => p.id)) + 1;
  const provider = {
    id,
    categoryId: Number(categoryId),
    firstName,
    lastName,
    businessName: `${firstName} ${lastName}`,
    email,
    password,
    phone,
    location,
    experienceYears: 0,
    available: true,
    rating: 0,
    ratingCount: 0,
    hourlyRate: 1000,
  };
  updateDb((d) => d.providers.push(provider));
  return loginProvider({ email, password });
}

export async function loginCustomer({ email, password }) {
  // TODO(API): POST http://localhost:8081/api/customers/login
  await delay();
  const db = getDb();
  const customer = db.customers.find((c) => c.email === email && c.password === password);
  if (!customer) throw new Error('Invalid email or password.');
  const session = { role: 'Customer', user: { ...customer, password: undefined } };
  const token = fakeJwt({ sub: customer.id, role: 'Customer' });
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(TOKEN_KEY, token);
  return session;
}

export async function loginProvider({ email, password }) {
  // TODO(API): POST http://localhost:8082/api/providers/login
  await delay();
  const db = getDb();
  const provider = db.providers.find((p) => p.email === email && p.password === password);
  if (!provider) throw new Error('Invalid email or password.');
  const session = { role: 'Provider', user: { ...provider, password: undefined } };
  const token = fakeJwt({ sub: provider.id, role: 'Provider' });
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(TOKEN_KEY, token);
  return session;
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken() {
  // TODO(API): attach as `Authorization: Bearer ${token}` on every request
  // once real JWTs are issued by the backend.
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
