import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const FEATURES = [
  { icon: 'bi-patch-check-fill', title: 'Verified Professionals', text: 'Trusted and background checked' },
  { icon: 'bi-lightning-charge-fill', title: 'Easy Bookings', text: 'Book in just a few clicks' },
  { icon: 'bi-shield-lock-fill', title: 'Secure Payments', text: 'Safe and secure transactions' },
];

const CATEGORIES = [
  { name: 'Electrician', icon: 'bi-lightning-charge' },
  { name: 'Plumber', icon: 'bi-droplet' },
  { name: 'Cleaner', icon: 'bi-stars' },
  { name: 'Painter', icon: 'bi-brush' },
  { name: 'AC Technician', icon: 'bi-snow' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="navbar hf-navbar py-3">
        <div className="container d-flex justify-content-between">
          <span className="hf-brand d-flex align-items-center gap-2">
            <Logo size={32} />
            Home<span className="accent">Fixr</span>
          </span>
          <div className="d-flex gap-2">
            <button className="btn btn-hf-outline" style={{ borderColor: '#fff', color: '#fff' }} onClick={() => navigate('/auth?mode=login')}>
              Login
            </button>
            <button className="btn btn-hf-gold" onClick={() => navigate('/auth?mode=signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <section className="hf-hero py-5">
        <div className="container py-5 text-center position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-4 hf-display mb-3" style={{ color: '#fff' }}>
            Find Trusted <span style={{ color: 'var(--hf-gold-500)' }}>Home Services</span>
          </h1>
          <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 620, margin: '0 auto' }}>
            Book electricians, plumbers, cleaners and more from verified professionals in your area &mdash; in just a few clicks.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-hf-gold btn-lg" onClick={() => navigate('/auth?mode=signup')}>
              Get Started
            </button>
            <button
              className="btn btn-lg"
              style={{ border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 700, borderRadius: 8 }}
              onClick={() => navigate('/auth?mode=login')}
            >
              I already have an account
            </button>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {FEATURES.map((f) => (
            <div className="col-md-4" key={f.title}>
              <div className="hf-card p-4 text-center h-100">
                <div className="hf-category-icon mx-auto mb-3">
                  <i className={`bi ${f.icon}`} />
                </div>
                <h5>{f.title}</h5>
                <p className="text-muted mb-0">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <h3 className="hf-section-title text-center mb-4">Popular Service Categories</h3>
        <div className="row g-3 justify-content-center">
          {CATEGORIES.map((c) => (
            <div className="col-6 col-md-2 text-center" key={c.name}>
              <div className="hf-category-icon mx-auto mb-2">
                <i className={`bi ${c.icon}`} />
              </div>
              <div className="small fw-bold">{c.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
