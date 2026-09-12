import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as bookingService from '../../services/bookingService';
import * as providerService from '../../services/providerService';

export default function ProviderDashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    bookingService.getBookingsByProvider(user.id).then((list) => {
      setStats({
        total: list.length,
        pending: list.filter((b) => b.status === 'Pending').length,
        completed: list.filter((b) => b.status === 'Completed').length,
      });
    });
  }, [user.id]);

  async function toggleAvailability() {
    setToggling(true);
    const updated = await providerService.updateAvailability(user.id, !user.available);
    refreshUser(updated);
    setToggling(false);
  }

  return (
    <div>
      <section className="hf-hero py-5">
        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
          <h1 className="hf-display" style={{ color: '#fff' }}>
            Smart Work <span style={{ color: 'var(--hf-gold-500)' }}>Smart Earn</span>
          </h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 560 }}>
            "Great service is not just a skill, it's an attitude." The most trusted platform among local service providers.
          </p>
          <div className="d-flex align-items-center gap-3 mt-4">
            <span className="text-white">Availability:</span>
            <button className={`btn btn-sm ${user.available ? 'btn-hf-gold' : 'btn-hf-outline'}`} style={!user.available ? { borderColor: '#fff', color: '#fff' } : {}} onClick={toggleAvailability} disabled={toggling}>
              {user.available ? 'Available' : 'Unavailable'} — tap to toggle
            </button>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-3 mb-5">
          <div className="col-md-4">
            <div className="hf-card p-4 text-center">
              <div className="fs-2 fw-bold" style={{ color: 'var(--hf-green-900)' }}>{stats.total}</div>
              <div className="text-muted">Total Bookings</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="hf-card p-4 text-center">
              <div className="fs-2 fw-bold" style={{ color: 'var(--hf-gold-700)' }}>{stats.pending}</div>
              <div className="text-muted">Pending Requests</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="hf-card p-4 text-center">
              <div className="fs-2 fw-bold" style={{ color: 'var(--hf-green-700)' }}>{stats.completed}</div>
              <div className="text-muted">Completed Jobs</div>
            </div>
          </div>
        </div>

        <div className="hf-card p-4 mb-5">
          <h5 className="mb-3">About Us</h5>
          <p className="text-muted mb-0">
            Welcome to our Home Service Booking Platform, where finding trusted professionals is simple, secure, and hassle-free.
            Whether customers need an electrician, plumber, cleaner, carpenter, painter, AC technician, CCTV specialist, or
            appliance repair expert, our platform connects them with verified service providers in just a few clicks. Manage your
            bookings, availability, and growing business — all from one dashboard.
          </p>
        </div>

        <div className="d-flex gap-3">
          <button className="btn btn-hf-primary" onClick={() => navigate('/provider/bookings')}>
            View Bookings
          </button>
          <button className="btn btn-hf-outline" onClick={() => navigate('/provider/profile')}>
            Edit Profile
          </button>
        </div>
      </section>
    </div>
  );
}
