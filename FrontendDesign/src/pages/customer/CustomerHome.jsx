import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as providerService from '../../services/providerService';
import { useAuth } from '../../context/AuthContext';

export default function CustomerHome() {
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    providerService.getCategories().then(setCategories);
  }, []);

  function goToCategory(catId) {
    navigate(`/customer/search?categoryId=${catId}`);
  }

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/customer/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div>
      <section className="hf-hero py-5">
        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
          <h1 className="hf-display" style={{ color: '#fff' }}>
            Welcome back, {user?.firstName}
          </h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 560 }}>
            "Great service is not just a skill, it's an attitude." Book reliable professionals for your home maintenance and repair needs.
          </p>
          <form className="d-flex gap-2 mt-4" style={{ maxWidth: 480 }} onSubmit={handleSearch}>
            <input
              className="form-control form-control-lg"
              placeholder="Search for a service…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-hf-gold btn-lg" type="submit">
              <i className="bi bi-search" />
            </button>
          </form>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="hf-section-title mb-0">Popular Services</h4>
          <button className="btn btn-hf-outline btn-sm" onClick={() => navigate('/customer/services')}>
            More <i className="bi bi-arrow-right ms-1" />
          </button>
        </div>
        <div className="row g-3">
          {categories.slice(0, 5).map((c) => (
            <div className="col-6 col-md-4 col-lg" key={c.id}>
              <div className="hf-card clickable p-3 text-center h-100" role="button" onClick={() => goToCategory(c.id)}>
                <div className="hf-category-icon mx-auto mb-2">
                  <i className={`bi ${c.icon}`} />
                </div>
                <div className="fw-bold small">{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <i className="bi bi-patch-check-fill fs-2" style={{ color: 'var(--hf-green-800)' }} />
            <h6 className="mt-2">Verified Professionals</h6>
            <p className="text-muted small">Trusted and background checked</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-lightning-charge-fill fs-2" style={{ color: 'var(--hf-green-800)' }} />
            <h6 className="mt-2">Easy Bookings</h6>
            <p className="text-muted small">Book in just a few clicks</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-shield-lock-fill fs-2" style={{ color: 'var(--hf-green-800)' }} />
            <h6 className="mt-2">Secure Payments</h6>
            <p className="text-muted small">Safe and secure transactions</p>
          </div>
        </div>
      </section>
    </div>
  );
}
