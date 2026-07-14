import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'Provider' ? '/provider/home' : '/customer/home'} replace />;
  }
  return children;
}
