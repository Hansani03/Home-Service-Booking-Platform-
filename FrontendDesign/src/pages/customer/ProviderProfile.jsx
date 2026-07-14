import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as providerService from '../../services/providerService';
import RatingStars from '../../components/RatingStars';

export default function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    providerService.getProviderById(id).then(async (p) => {
      setProvider(p);
      if (p) setCategory(await providerService.getCategoryById(p.categoryId));
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted">
        <div className="spinner-border" style={{ color: 'var(--hf-green-800)' }} role="status" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Provider not found.</p>
        <button className="btn btn-hf-outline" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <button className="btn btn-link text-decoration-none mb-3 p-0" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-1" /> Back to results
      </button>

      <div className="hf-card p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 72, height: 72, background: 'var(--hf-green-100)', color: 'var(--hf-green-800)', fontWeight: 700, fontSize: '1.4rem' }}
            >
              {provider.firstName[0]}
              {provider.lastName[0]}
            </div>
            <div>
              <h3 className="mb-0">{provider.businessName}</h3>
              <div className="text-muted">{category?.name}</div>
              <RatingStars rating={provider.rating} count={provider.ratingCount} />
            </div>
          </div>
          {provider.available ? (
            <span className="hf-badge-status status-completed fs-6">Available</span>
          ) : (
            <span className="hf-badge-status status-rejected fs-6">Unavailable</span>
          )}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-sm-6">
            <div className="text-muted small">First Name</div>
            <div className="fw-bold">{provider.firstName}</div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Last Name</div>
            <div className="fw-bold">{provider.lastName}</div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Email</div>
            <div className="fw-bold">{provider.email}</div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Phone</div>
            <div className="fw-bold">{provider.phone}</div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">City</div>
            <div className="fw-bold">{provider.location}</div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Years of Experience</div>
            <div className="fw-bold">{provider.experienceYears}</div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Rate</div>
            <div className="fw-bold">Rs. {provider.hourlyRate.toLocaleString()} / hr</div>
          </div>
        </div>

        <div className="border-top pt-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h5 className="mb-0">Ready to Book?</h5>
            <p className="text-muted small mb-0">Set your date, time, and describe the issue on the next step.</p>
          </div>
          <button
            className="btn btn-hf-primary btn-lg"
            disabled={!provider.available}
            onClick={() => navigate(`/customer/book/${provider.id}`)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
