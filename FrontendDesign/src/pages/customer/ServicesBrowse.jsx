import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as providerService from '../../services/providerService';

export default function ServicesBrowse() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    providerService.getCategories().then(setCategories);
  }, []);

  function goToCategory(catId) {
    const params = new URLSearchParams();
    params.set('categoryId', catId);
    if (city) params.set('city', city);
    navigate(`/customer/search?${params.toString()}`);
  }

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city) params.set('city', city);
    navigate(`/customer/search?${params.toString()}`);
  }

  return (
    <div className="container py-5">
      <h3 className="hf-section-title">Find Your Service Provider</h3>
      <p className="text-muted">Browse by category or search directly for what you need.</p>

      <form className="hf-card p-3 mb-4" onSubmit={handleSearch}>
        <div className="row g-2 align-items-end">
          <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Search</label>
            <input className="form-control" placeholder="Search for a service…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted mb-1">City</label>
            <input className="form-control" placeholder="e.g. Colombo" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-hf-primary w-100" type="submit">
              <i className="bi bi-funnel me-1" />
              Filter
            </button>
          </div>
        </div>
      </form>

      <h6 className="text-muted text-uppercase small fw-bold mb-3">Categories</h6>
      <div className="row g-3">
        {categories.map((c) => (
          <div className="col-6 col-md-3" key={c.id}>
            <div className="hf-card clickable p-4 text-center h-100" role="button" onClick={() => goToCategory(c.id)}>
              <div className="hf-category-icon mx-auto mb-3">
                <i className={`bi ${c.icon}`} />
              </div>
              <div className="fw-bold">{c.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
