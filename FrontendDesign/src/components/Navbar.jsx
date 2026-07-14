import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import Logo from './Logo';

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();

  const customerLinks = [
    { to: '/customer/home', label: 'Home' },
    { to: '/customer/services', label: 'Services' },
    { to: '/customer/bookings', label: 'Bookings' },
  ];
  const providerLinks = [
    { to: '/provider/home', label: 'Home' },
    { to: '/provider/profile', label: 'Edit Profile' },
    { to: '/provider/bookings', label: 'Bookings' },
  ];

  const links = role === 'Provider' ? providerLinks : customerLinks;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg hf-navbar py-2 sticky-top">
      <div className="container">
        <NavLink to={isAuthenticated ? (role === 'Provider' ? '/provider/home' : '/customer/home') : '/'} className="navbar-brand d-flex align-items-center gap-2 hf-brand">
          <Logo size={30} />
          Home<span className="accent">Fixr</span>
        </NavLink>

        {isAuthenticated && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#hfNav"
              aria-controls="hfNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="hfNav">
              <ul className="navbar-nav mx-auto">
                {links.map((l) => (
                  <li className="nav-item" key={l.to}>
                    <NavLink to={l.to} className="nav-link">
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="d-flex align-items-center gap-3">
                <NotificationBell />
                <div className="dropdown">
                  <button
                    className="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center gap-2"
                    data-bs-toggle="dropdown"
                  >
                    <span
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32, background: 'var(--hf-gold-600)', color: 'var(--hf-green-950)', fontWeight: 700, fontSize: '0.85rem' }}
                    >
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                    <span className="d-none d-md-inline">{user?.firstName}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <span className="dropdown-item-text small text-muted">Signed in as {role}</span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2" />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
