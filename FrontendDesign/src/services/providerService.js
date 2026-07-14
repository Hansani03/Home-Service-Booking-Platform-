// providerService.js
// -----------------------------------------------------------------------------
// Maps 1:1 to the Provider Microservice (http://localhost:8082).
// -----------------------------------------------------------------------------
import { getDb, updateDb, delay } from './mockDb';

export async function getCategories() {
  // TODO(API): GET /api/categories
  await delay(200);
  return getDb().categories;
}

export async function getCategoryById(id) {
  // TODO(API): GET /api/categories/{id}
  await delay(150);
  return getDb().categories.find((c) => c.id === Number(id)) || null;
}

export async function getAllProviders() {
  // TODO(API): GET /api/providers
  await delay();
  return getDb().providers;
}

export async function getAvailableProviders() {
  // TODO(API): GET /api/providers/available
  await delay();
  return getDb().providers.filter((p) => p.available);
}

export async function getProviderById(id) {
  // TODO(API): GET /api/providers/{id}
  await delay(250);
  return getDb().providers.find((p) => p.id === Number(id)) || null;
}

export async function getProvidersByCategory(categoryId) {
  // TODO(API): GET /api/providers/category/{categoryId}
  await delay();
  return getDb().providers.filter((p) => p.categoryId === Number(categoryId));
}

export async function providerExists(id) {
  // TODO(API): GET /api/providers/{id}/exists
  await delay(100);
  return getDb().providers.some((p) => p.id === Number(id));
}

export async function updateAvailability(id, available) {
  // TODO(API): PUT /api/providers/{id}/availability
  await delay(200);
  updateDb((d) => {
    const p = d.providers.find((pr) => pr.id === Number(id));
    if (p) p.available = available;
  });
  return getProviderById(id);
}

export async function updateProviderProfile(id, updates) {
  // TODO(API): PUT /api/providers/{id}
  await delay(300);
  updateDb((d) => {
    const p = d.providers.find((pr) => pr.id === Number(id));
    if (p) Object.assign(p, updates);
  });
  return getProviderById(id);
}

export async function searchProviders({ query = '', categoryId = null, city = '', sortBy = 'rating' } = {}) {
  await delay();
  let results = getDb().providers;
  if (categoryId) results = results.filter((p) => p.categoryId === Number(categoryId));
  if (city) results = results.filter((p) => p.location.toLowerCase().includes(city.toLowerCase()));
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) => p.businessName.toLowerCase().includes(q) || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    );
  }
  results = [...results];
  if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'price_low') results.sort((a, b) => a.hourlyRate - b.hourlyRate);
  else if (sortBy === 'price_high') results.sort((a, b) => b.hourlyRate - a.hourlyRate);
  else if (sortBy === 'experience') results.sort((a, b) => b.experienceYears - a.experienceYears);
  return results;
}

export async function addRating(providerId, ratingValue) {
  await delay(300);
  updateDb((d) => {
    const p = d.providers.find((pr) => pr.id === Number(providerId));
    if (p) {
      const totalPoints = p.rating * p.ratingCount + ratingValue;
      p.ratingCount += 1;
      p.rating = Math.round((totalPoints / p.ratingCount) * 10) / 10;
    }
  });
  return getProviderById(providerId);
}
