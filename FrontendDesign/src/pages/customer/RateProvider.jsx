import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as bookingService from '../../services/bookingService';
import * as providerService from '../../services/providerService';

export default function RateProvider() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [provider, setProvider] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const b = await bookingService.getBookingById(id);
      setBooking(b);
      if (b) setProvider(await providerService.getProviderById(b.providerId));
      setLoading(false);
    })();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) return;
    await providerService.addRating(provider.id, rating);
    setSubmitted(true);
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--hf-green-800)' }} role="status" />
      </div>
    );
  }

  if (!booking || !provider) {
    return (
      <div className="container py-5 text-center text-muted">
        <p>Booking not found.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
        <i className="bi bi-check-circle-fill fs-1" style={{ color: 'var(--hf-green-800)' }} />
        <h4 className="mt-3">Thanks for your feedback!</h4>
        <p className="text-muted">Your rating helps other customers choose trusted providers.</p>
        <button className="btn btn-hf-primary" onClick={() => navigate('/customer/bookings')}>
          Back to My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="hf-card p-4">
        <h4 className="hf-section-title mb-1">Rate: {provider.businessName}</h4>
        <p className="text-muted small mb-4">Booking BK-{booking.id} &middot; {booking.bookingDate}</p>

        <form onSubmit={handleSubmit}>
          <label className="form-label small fw-bold">Rating</label>
          <div className="d-flex gap-1 mb-4" style={{ fontSize: '2rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${(hover || rating) >= star ? 'bi-star-fill' : 'bi-star'}`}
                style={{ color: 'var(--hf-gold-600)', cursor: 'pointer' }}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <label className="form-label small fw-bold">Description</label>
          <textarea
            className="form-control mb-4"
            rows={4}
            placeholder="Describe your experience…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="btn btn-hf-primary w-100" type="submit" disabled={rating === 0}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
