import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as providerService from '../../services/providerService';
import Logo from '../../components/Logo';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  city: '',
  categoryId: '',
};

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [role, setRole] = useState('Customer');
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    providerService.getCategories().then(setCategories);
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let session;
      if (mode === 'login') {
        session = await login(role, { email: form.email, password: form.password });
      } else {
        if (role === 'Customer') {
          session = await signup('Customer', {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            phone: form.phone,
            address: form.address,
          });
        } else {
          session = await signup('Provider', {
            firstName: form.firstName,
            lastName: form.lastName,
            categoryId: form.categoryId,
            email: form.email,
            password: form.password,
            phone: form.phone,
            location: form.city,
          });
        }
      }
      navigate(session.role === 'Provider' ? '/provider/home' : '/customer/home');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hf-hero d-flex align-items-center py-5" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 460 }}>
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 hf-brand">
            <Logo size={34} />
            Home<span className="accent">Fixr</span>
          </Link>
        </div>

        <div className="bg-white text-dark rounded-4 shadow-lg p-4 p-md-5">
          <ul className="nav nav-pills nav-fill mb-4" style={{ background: 'var(--hf-green-100)', borderRadius: 10, padding: 4 }}>
            <li className="nav-item">
              <button
                className={`nav-link ${mode === 'login' ? 'active' : ''}`}
                style={mode === 'login' ? { background: 'var(--hf-green-900)' } : { color: 'var(--hf-green-900)' }}
                onClick={() => setMode('login')}
                type="button"
              >
                Login
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${mode === 'signup' ? 'active' : ''}`}
                style={mode === 'signup' ? { background: 'var(--hf-green-900)' } : { color: 'var(--hf-green-900)' }}
                onClick={() => setMode('signup')}
                type="button"
              >
                Create Account
              </button>
            </li>
          </ul>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">I am a</label>
            <div className="d-flex gap-2">
              <button
                type="button"
                className={`btn flex-fill ${role === 'Customer' ? 'btn-hf-primary' : 'btn-hf-outline'}`}
                onClick={() => setRole('Customer')}
              >
                <i className="bi bi-person me-1" /> Customer
              </button>
              <button
                type="button"
                className={`btn flex-fill ${role === 'Provider' ? 'btn-hf-primary' : 'btn-hf-outline'}`}
                onClick={() => setRole('Provider')}
              >
                <i className="bi bi-toolbox me-1" /> Service Provider
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small">First Name</label>
                    <input required className="form-control" placeholder="Enter first name" autoComplete="given-name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label small">Last Name</label>
                    <input required className="form-control" placeholder="Enter last name" autoComplete="family-name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
                  </div>
                </div>
                {role === 'Provider' && (
                  <div className="mb-2">
                    <label className="form-label small">Category</label>
                    <select required className="form-select" value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
                      <option value="">Select a category…</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="mb-2">
              <label className="form-label small">Email</label>
              <input required type="email" className="form-control" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label small">Password</label>
              <input required type="password" className="form-control" placeholder="Minimum 6 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={(e) => update('password', e.target.value)} minLength={6} />
            </div>

            {mode === 'signup' && (
              <>
                <div className="mb-2">
                  <label className="form-label small">Phone</label>
                  <input required type="tel" className="form-control" placeholder="e.g. 0771234567" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                </div>
                {role === 'Customer' ? (
                  <div className="mb-3">
                    <label className="form-label small">Address</label>
                    <input required className="form-control" placeholder="Enter service address" autoComplete="street-address" value={form.address} onChange={(e) => update('address', e.target.value)} />
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label small">City</label>
                    <input required className="form-control" placeholder="e.g. Colombo" autoComplete="address-level2" value={form.city} onChange={(e) => update('city', e.target.value)} />
                  </div>
                )}
              </>
            )}

            <button type="submit" className="btn btn-hf-primary w-100 mt-2" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Submit' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-3 small">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button className="btn btn-link p-0" onClick={() => setMode('signup')}>
                  Create Account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button className="btn btn-link p-0" onClick={() => setMode('login')}>
                  Login
                </button>
              </span>
            )}
          </div>
          {mode === 'login' && (
            <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.75rem' }}>
              Demo login: eric@quickfix.com / 123456 (Provider) &middot; nate@example.com / 123456 (Customer)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
