import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as bookingService from '../../services/bookingService';
import * as providerService from '../../services/providerService';
import { useAuth } from '../../context/AuthContext';
import BookingStatusBadge from '../../components/BookingStatusBadge';

const TABS = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected', 'Cancelled'];

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState({});
  const [tab, setTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await bookingService.getBookingsByCustomer(user.id);
      setBookings(list);
      const uniqueProviderIds = [...new Set(list.map((b) => b.providerId))];
      const providerEntries = await Promise.all(uniqueProviderIds.map((id) => providerService.getProviderById(id)));
      const map = {};
      providerEntries.forEach((p) => {
        if (p) map[p.id] = p;
      });
      setProviders(map);
      setLoading(false);
    })();
  }, [user.id]);

  const filtered = tab === 'All' ? bookings : bookings.filter((b) => b.status === tab);

  return (
    <div className="container py-5">
      <h3 className="hf-section-title mb-4">My Bookings</h3>

      <ul className="nav nav-pills mb-4 flex-wrap gap-2">
        {TABS.map((t) => (
          <li className="nav-item" key={t}>
            <button
              className="btn btn-sm"
              style={
                tab === t
                  ? { background: 'var(--hf-green-900)', color: '#fff', borderRadius: 20, fontWeight: 700, padding: '0.4rem 1rem' }
                  : { background: 'var(--hf-green-100)', color: 'var(--hf-green-900)', borderRadius: 20, fontWeight: 700, padding: '0.4rem 1rem' }
              }
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: 'var(--hf-green-800)' }} role="status" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-calendar-x fs-1 d-block mb-2" />
          No bookings in this category yet.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((b) => {
            const provider = providers[b.providerId];
            return (
              <div className="hf-card p-3 d-flex flex-wrap justify-content-between align-items-center gap-3" key={b.id}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 48, height: 48, background: 'var(--hf-green-100)', color: 'var(--hf-green-800)', fontWeight: 700 }}
                  >
                    {provider ? `${provider.firstName[0]}${provider.lastName[0]}` : '?'}
                  </div>
                  <div>
                    <div className="fw-bold">{provider?.businessName || 'Provider'}</div>
                    <div className="text-muted small">
                      BK-{b.id} &middot; {b.bookingDate} at {b.bookingTime}
                    </div>
                    <RatingsAndPrice rating={provider?.rating} amount={b.totalAmount} />
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <BookingStatusBadge status={b.status} />
                  <button className="btn btn-hf-outline btn-sm" onClick={() => navigate(`/customer/bookings/${b.id}`)}>
                    View Details <i className="bi bi-chevron-right ms-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RatingsAndPrice({ rating, amount }) {
  return (
    <div className="small text-muted">
      {typeof rating === 'number' && (
        <span className="me-2">
          <i className="bi bi-star-fill me-1" style={{ color: 'var(--hf-gold-600)' }} />
          {rating.toFixed(1)}
        </span>
      )}
      Rs. {amount.toLocaleString()}
    </div>
  );
}
