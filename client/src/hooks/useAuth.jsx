import { useState, useEffect, useCallback } from 'react';
import api from '../api.js';

// Auth context: manages admin authentication state
const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/me');
      setAdmin(data.admin);
      setError(null);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/admin/login', { email, password });
      setAdmin(data.admin);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/admin/logout');
      setAdmin(null);
    } catch {
      // Even if the request fails, clear local state
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, loading, error, login, logout, refresh: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Need React for the context
import React from 'react';