import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import AuthContext from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      let decoded = null;
      try {
        decoded = jwtDecode(storedToken);
      } catch {
        // Decoding failed: keep going if we have a stored user; otherwise we'll clear below
        console.warn('Failed to decode token; proceeding with stored user if present');
      }

      // Determine validity: if token has an exp claim, enforce it; if not, treat as valid
      const hasExp = decoded && typeof decoded.exp === 'number';
      const isValid = hasExp ? decoded.exp * 1000 > Date.now() : true;

      if (isValid) {
        setToken(storedToken);
        // Prefer persisted user if available; otherwise derive minimal fields from token if present
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            const u = decoded ? { id: decoded.id, role: decoded.role } : null;
            if (u) {
              setUser(u);
              localStorage.setItem('user', JSON.stringify(u));
            } else {
              // No reliable user info; leave as null and let app fetch /me if implemented
              setUser(null);
            }
          }
        } else if (decoded) {
          const u = { id: decoded.id, role: decoded.role };
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        // Try to hydrate from /auth/me (optional)
        (async () => {
          try {
            const res = await api.get('/auth/me');
            const u = res.data?.user || res.data;
            if (u) {
              setUser(u);
              localStorage.setItem('user', JSON.stringify(u));
            }
            const perms = res.data?.permissions || u?.permissions || [];
            if (Array.isArray(perms)) setPermissions(perms);
          } catch {
            // ignore if endpoint not available
          }
        })();
      } else {
        // Only clear if token explicitly expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.warn('Failed to persist user to localStorage', e);
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    // Optional follow-up to hydrate permissions
    (async () => {
      try {
        const res = await api.get('/auth/me');
        const perms = res.data?.permissions || [];
        if (Array.isArray(perms)) setPermissions(perms);
      } catch {
        // Endpoint may not exist; proceed without permission hydration
        void 0;
      }
    })();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  const hasPermission = (perm) => {
    if (!perm) return true;
    return Array.isArray(permissions) && permissions.includes(perm);
  };

  return (
    <AuthContext.Provider value={{ user, token, permissions, hasPermission, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
