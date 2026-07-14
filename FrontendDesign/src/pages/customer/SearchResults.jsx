import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as providerService from '../../services/providerService';
import ProviderCard from '../../components/ProviderCard';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const city = searchParams.get('city') || '';
  const sortBy = searchParams.get('sortBy') || 'rating';

  useEffect(() => {
    providerService.getCategories().then(setCategories);
  }, []);

  const runSearch = useCallback(async () => {
    setLoading(true);
    const results = await providerService.searchProviders({ query: q, categoryId: categoryId || null, city, sortBy });
    setProviders(results);
    setLoading(false);
  }, [q, categoryId, city, sortBy]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  const categoryName = categories.find((c) => String(c.id) === String(categoryId))?.name;

  return (
    <div className="container py-5">
      <h3 className="hf-section-title">
        Search Result{categoryName ? ` for: ${categoryName}` : q ? ` for: "${q}"` : ''}
      </h3>

      <div className="hf-card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small text-muted mb-1">Category</label>
            <select className="form-select" value={categoryId} onChange={(e) => updateParam('categoryId', e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted mb-1">City</label>
            <input className="form-control" value={city} onChange={(e) => updateParam('city', e.target.value)} placeholder="e.g. Colombo" />
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted mb-1">Sort by</label>
            <select className="form-select" value={sortBy} onChange={(e) => updateParam('sortBy', e.target.value)}>
              <option value="rating">Highest Rating</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>
          <div className="col-md-2 text-md-end text-muted small">
            {!loading && <span>{providers.length} providers found</span>}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border" style={{ color: 'var(--hf-green-800)' }} role="status" />
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-search fs-1 d-block mb-2" />
          No providers matched your search. Try a different category or city.
        </div>
      ) : (
        <div className="row g-3">
          {providers.map((p) => (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <ProviderCard provider={p} categoryName={categories.find((c) => c.id === p.categoryId)?.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
