import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Guarded route component: redirects to /login when unauthenticated
function RequireAuth({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Render children directly or use outlet for nested routes
  return children ? children : <Outlet />;
}

export default RequireAuth;
