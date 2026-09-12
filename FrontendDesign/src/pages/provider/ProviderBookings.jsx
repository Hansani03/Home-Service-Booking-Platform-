import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as bookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import BookingStatusBadge from '../../components/BookingStatusBadge';

const TABS = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected'];

export default function ProviderBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [user.id]);

  async function load() {
    setLoading(true);
    const list = await bookingService.getBookingsByProvider(user.id);
    setBookings(list);
    setLoading(false);
  }

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
        <div className="hf-card">
          <table className="table mb-0 align-middle">
            <thead>
              <tr className="text-muted small text-uppercase">
                <th className="ps-3">Booking ID</th>
                <th>Date &amp; Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="pe-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td className="ps-3 fw-bold">BK-{b.id}</td>
                  <td>
                    {b.bookingDate} {b.bookingTime}
                  </td>
                  <td>Rs. {b.totalAmount.toLocaleString()}</td>
                  <td>
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="pe-3 text-end">
                    <button className="btn btn-hf-outline btn-sm" onClick={() => navigate(`/provider/bookings/${b.id}`)}>
                      View Details <i className="bi bi-chevron-right ms-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
