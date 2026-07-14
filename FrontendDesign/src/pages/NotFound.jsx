import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="hf-display display-1" style={{ color: 'var(--hf-gold-600)' }}>404</h1>
      <p className="text-muted mb-4">This page doesn't exist.</p>
      <Link to="/" className="btn btn-hf-primary">
        Back to Home
      </Link>
    </div>
  );
}
