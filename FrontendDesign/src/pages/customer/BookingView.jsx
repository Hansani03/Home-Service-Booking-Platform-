import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as bookingService from '../../services/bookingService';
import * as providerService from '../../services/providerService';
import BookingStatusBadge from '../../components/BookingStatusBadge';

export default function BookingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const b = await bookingService.getBookingById(id);
      setBooking(b);
      if (b) setProvider(await providerService.getProviderById(b.providerId));
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--hf-green-800)' }} role="status" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center text-muted">
        <p>Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <button className="btn btn-link text-decoration-none mb-3 p-0" onClick={() => navigate('/customer/bookings')}>
        <i className="bi bi-arrow-left me-1" /> Back to My Bookings
      </button>

      <div className="hf-card p-4">
        <h4 className="hf-section-title mb-4">Booking Details</h4>
        <div className="row g-3 mb-3">
          <div className="col-6">
            <div className="text-muted small">Booking ID</div>
            <div className="fw-bold">BK-{booking.id}</div>
          </div>
          <div className="col-6">
            <div className="text-muted small">Provider</div>
            <div className="fw-bold">{provider?.businessName}</div>
          </div>
          <div className="col-6">
            <div className="text-muted small">Booking Date</div>
            <div className="fw-bold">{booking.bookingDate}</div>
          </div>
          <div className="col-6">
            <div className="text-muted small">Booking Time</div>
            <div className="fw-bold">{booking.bookingTime}</div>
          </div>
          <div className="col-12">
            <div className="text-muted small">Service Address</div>
            <div className="fw-bold">{booking.serviceAddress}</div>
          </div>
          <div className="col-12">
            <div className="text-muted small">Description / Notes</div>
            <div className="fw-bold">{booking.description || '—'}</div>
          </div>
        </div>

        <div className="d-flex justify-content-between border-top border-bottom py-3 my-3 flex-wrap gap-2">
          <div>
            <div className="text-muted small">Booking Status</div>
            <BookingStatusBadge status={booking.status} />
          </div>
          <div>
            <div className="text-muted small">Payment Status</div>
            <BookingStatusBadge status={booking.paymentStatus} />
          </div>
          <div className="text-end">
            <div className="text-muted small">Amount</div>
            <div className="fw-bold fs-5" style={{ color: 'var(--hf-green-900)' }}>
              Rs. {booking.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          {booking.paymentStatus !== 'Success' && booking.status !== 'Cancelled' && booking.status !== 'Rejected' && (
            <button className="btn btn-hf-primary" onClick={() => navigate(`/customer/payment/${booking.id}`)}>
              Proceed to Pay
            </button>
          )}
          {booking.status === 'Completed' && (
            <button className="btn btn-hf-gold" onClick={() => navigate(`/customer/bookings/${booking.id}/rate`)}>
              Rate Provider
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
