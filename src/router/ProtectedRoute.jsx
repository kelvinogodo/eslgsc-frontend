import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const ProtectedRoute = ({ children, allowedRoles, requiredPermissions }) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
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
