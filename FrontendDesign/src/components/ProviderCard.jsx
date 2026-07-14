import { useNavigate } from 'react-router-dom';
import RatingStars from './RatingStars';

export default function ProviderCard({ provider, categoryName }) {
  const navigate = useNavigate();
  const initials = `${provider.firstName[0]}${provider.lastName[0]}`;

  return (
    <div className="hf-card clickable p-3 h-100 d-flex flex-column" role="button" onClick={() => navigate(`/customer/providers/${provider.id}`)}>
      <div className="d-flex align-items-start gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 56, height: 56, background: 'var(--hf-green-100)', color: 'var(--hf-green-800)', fontWeight: 700 }}
        >
          {initials}
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-0 fw-bold">{provider.businessName}</h6>
          {categoryName && <div className="text-muted small">{categoryName}</div>}
          <RatingStars rating={provider.rating} count={provider.ratingCount} />
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <div className="fw-bold" style={{ color: 'var(--hf-green-900)' }}>
            Rs. {provider.hourlyRate.toLocaleString()} / hr
          </div>
          <div className="small text-muted">
            <i className="bi bi-geo-alt me-1" />
            {provider.location}
          </div>
        </div>
        {provider.available ? (
          <span className="hf-badge-status status-completed">Available</span>
        ) : (
          <span className="hf-badge-status status-rejected">Unavailable</span>
        )}
      </div>
      <button
        className="btn btn-hf-outline btn-sm mt-3"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/customer/providers/${provider.id}`);
        }}
      >
        View Profile
      </button>
    </div>
  );
}
