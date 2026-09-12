import { apiRequest } from './api';

const CATEGORY_ICONS = { Electrician: 'bi-lightning-charge', Plumber: 'bi-droplet', Cleaner: 'bi-stars', Carpenter: 'bi-hammer', Painter: 'bi-brush' };
const normalizeCategory = (c) => ({ ...c, id: c.categoryId, name: c.categoryName, icon: CATEGORY_ICONS[c.categoryName] || 'bi-tools' });
const normalizeProvider = (p) => p && ({
  ...p,
  id: p.providerId,
  businessName: `${p.firstName} ${p.lastName}`,
  available: String(p.availability).toLowerCase() === 'available',
  rating: Number(p.rating || 0),
  ratingCount: p.ratingCount || 0,
  hourlyRate: Number(p.hourlyRate || 1000),
});

export async function getCategories() { return (await apiRequest('provider', '/categories')).map(normalizeCategory); }
export async function getCategoryById(id) { return normalizeCategory(await apiRequest('provider', `/categories/${id}`)); }
export async function getAllProviders() { return (await apiRequest('provider', '/providers')).map(normalizeProvider); }
export async function getAvailableProviders() { return (await apiRequest('provider', '/providers/available')).map(normalizeProvider); }
export async function getProviderById(id) { return normalizeProvider(await apiRequest('provider', `/providers/${id}`)); }
export async function getProvidersByCategory(id) { return (await apiRequest('provider', `/providers/category/${id}`)).map(normalizeProvider); }
export async function providerExists(id) { return (await apiRequest('provider', `/providers/${id}/exists`)).exists; }

export async function updateAvailability(id, available) {
  return normalizeProvider(await apiRequest('provider', `/providers/${id}/availability`, {
    method: 'PUT', body: JSON.stringify({ availability: available ? 'Available' : 'Offline' }),
  }));
}

export async function updateProviderProfile(id, updates) {
  return normalizeProvider(await apiRequest('provider', `/providers/${id}`, { method: 'PUT', body: JSON.stringify(updates) }));
}

export async function addRating(id, rating) {
  return normalizeProvider(await apiRequest('provider', `/providers/${id}/rating`, { method: 'POST', body: JSON.stringify({ rating }) }));
}

export async function searchProviders({ query = '', categoryId = null, city = '', sortBy = 'rating' } = {}) {
  let results = categoryId ? await getProvidersByCategory(categoryId) : await getAllProviders();
  if (city) results = results.filter((p) => (p.location || '').toLowerCase().includes(city.toLowerCase()));
  if (query) {
    const q = query.toLowerCase();
    results = results.filter((p) => p.businessName.toLowerCase().includes(q) || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q));
  }
  if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'price_low') results.sort((a, b) => a.hourlyRate - b.hourlyRate);
  else if (sortBy === 'price_high') results.sort((a, b) => b.hourlyRate - a.hourlyRate);
  else if (sortBy === 'experience') results.sort((a, b) => b.experienceYears - a.experienceYears);
  return results;
}
