import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

interface PrivateRouteProps {
  element: JSX.Element;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedRoles }) => {
  const { isAuthenticated, rol } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(rol || '')) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;