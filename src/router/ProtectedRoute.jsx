import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../context/useAuth';

const ProtectedRoute = ({ children, allowedRoles, requiredPermissions }) => {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    // Remember where they were headed so sign-in can take them straight back.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const ok = requiredPermissions.every((p) => hasPermission(p));
    if (!ok) return <Navigate to="/unauthorized" replace />;
  }

  if (!requiredPermissions && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
