import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as providerService from '../../services/providerService';
import * as bookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import BookingStatusBadge from '../../components/BookingStatusBadge';

export default function BookingDetails() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    bookingDate: '',
    bookingTime: '',
    serviceAddress: user?.address || '',
    description: '',
    hours: 2,
  });

  useEffect(() => {
    providerService.getProviderById(providerId).then((p) => {
      setProvider(p);
      setLoading(false);
    });
  }, [providerId]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const estimatedPrice = provider ? provider.hourlyRate * Number(form.hours || 1) : 0;

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const newBooking = await bookingService.createBooking({
        customerId: user.id,
        providerId: provider.id,
        categoryId: provider.categoryId,
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        serviceAddress: form.serviceAddress,
        description: form.description,
        totalAmount: estimatedPrice,
      });
      setBooking(newBooking);
    } catch (err) {
      setError(err.message || 'Could not create the booking. Please try again.');
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted">
        <div className="spinner-border" style={{ color: 'var(--hf-green-800)' }} role="status" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container py-5 text-center text-muted">
        <p>Provider not found.</p>
      </div>
    );
  }

  // Step 2: booking created — show summary + proceed to pay
  if (booking) {
    return (
      <div className="container py-5" style={{ maxWidth: 640 }}>
        <div className="hf-card p-4">
          <h4 className="hf-section-title mb-4">Booking Details</h4>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <div className="text-muted small">Booking ID</div>
              <div className="fw-bold">BK-{booking.id}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Customer ID</div>
              <div className="fw-bold">{booking.customerId}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Provider Name</div>
              <div className="fw-bold">{provider.businessName}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Booking Date</div>
              <div className="fw-bold">{booking.bookingDate}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Booking Time</div>
              <div className="fw-bold">{booking.bookingTime}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Service Address</div>
              <div className="fw-bold">{booking.serviceAddress}</div>
            </div>
            <div className="col-12">
              <div className="text-muted small">Description / Notes</div>
              <div className="fw-bold">{booking.description || '—'}</div>
            </div>
          </div>

          <div className="d-flex justify-content-between border-top border-bottom py-3 my-3">
            <div>
              <div className="text-muted small">Booking Status</div>
              <BookingStatusBadge status={booking.status} />
            </div>
            <div>
              <div className="text-muted small">Payment Status</div>
              <BookingStatusBadge status={booking.paymentStatus === 'Pending' ? 'Pending' : booking.paymentStatus} />
            </div>
            <div className="text-end">
              <div className="text-muted small">Estimated Price</div>
              <div className="fw-bold fs-5" style={{ color: 'var(--hf-green-900)' }}>
                Rs. {booking.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <p className="text-muted small mb-0">Continue to Pay?</p>
            <div className="d-flex gap-2">
              <button className="btn btn-hf-outline" onClick={() => navigate('/customer/bookings')}>
                Pay Later
              </button>
              <button className="btn btn-hf-primary" onClick={() => navigate(`/customer/payment/${booking.id}`)}>
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: booking form
  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <button className="btn btn-link text-decoration-none mb-3 p-0" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-1" /> Back
      </button>
      <div className="hf-card p-4">
        <h4 className="hf-section-title mb-1">Book {provider.businessName}</h4>
        <p className="text-muted mb-4">Rs. {provider.hourlyRate.toLocaleString()} / hr &middot; {provider.location}</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleCreate}>
          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <label className="form-label small">Booking Date</label>
              <input required type="date" className="form-control" value={form.bookingDate} onChange={(e) => update('bookingDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">Booking Time</label>
              <input required type="time" className="form-control" value={form.bookingTime} onChange={(e) => update('bookingTime', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label small">Service Address</label>
              <input required className="form-control" value={form.serviceAddress} onChange={(e) => update('serviceAddress', e.target.value)} placeholder="123, Main Street, Colombo" />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">Estimated Hours Needed</label>
              <input required type="number" min={1} max={12} className="form-control" value={form.hours} onChange={(e) => update('hours', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">Estimated Price</label>
              <input disabled className="form-control fw-bold" value={`Rs. ${estimatedPrice.toLocaleString()}`} />
            </div>
            <div className="col-12">
              <label className="form-label small">Description / Notes</label>
              <textarea className="form-control" rows={3} placeholder="Describe your issue…" value={form.description} onChange={(e) => update('description', e.target.value)} />
            </div>
          </div>
          <button className="btn btn-hf-primary w-100" type="submit" disabled={creating}>
            {creating ? 'Creating Booking…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
