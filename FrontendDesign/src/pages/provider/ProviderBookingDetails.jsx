import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as bookingService from '../../services/bookingService';
import BookingStatusBadge from '../../components/BookingStatusBadge';

export default function ProviderBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    const b = await bookingService.getBookingById(id);
    setBooking(b);
    setLoading(false);
  }

  async function setStatus(status) {
    setUpdating(true);
    const updated = await bookingService.updateBookingStatus(id, status);
    setBooking(updated);
    setUpdating(false);
  }

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
      <button className="btn btn-link text-decoration-none mb-3 p-0" onClick={() => navigate('/provider/bookings')}>
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
            <div className="text-muted small">Customer ID</div>
            <div className="fw-bold">{booking.customerId}</div>
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
          {booking.status === 'Pending' && (
            <>
              <button className="btn btn-outline-danger" disabled={updating} onClick={() => setStatus('Rejected')}>
                Reject
              </button>
              <button className="btn btn-hf-primary" disabled={updating} onClick={() => setStatus('Accepted')}>
                Accept
              </button>
            </>
          )}
          {booking.status === 'Accepted' && (
            <button className="btn btn-hf-primary" disabled={updating} onClick={() => setStatus('In Progress')}>
              Start Job
            </button>
          )}
          {booking.status === 'In Progress' && (
            <button className="btn btn-hf-primary" disabled={updating} onClick={() => setStatus('Completed')}>
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
