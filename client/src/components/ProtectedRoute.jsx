import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

/**
 * ProtectedRoute - redirects to /admin/login if not authenticated
 * Preserves the attempted URL so we can redirect back after login
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin__loading" role="status" aria-label="Checking authentication">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location they tried to access
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}