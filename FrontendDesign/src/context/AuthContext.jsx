import { createContext, useContext, useState, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession());

  const login = useCallback(async (role, credentials) => {
    const s = role === 'Provider' ? await authService.loginProvider(credentials) : await authService.loginCustomer(credentials);
    setSession(s);
    return s;
  }, []);

  const signup = useCallback(async (role, formData) => {
    const s = role === 'Provider' ? await authService.signupProvider(formData) : await authService.signupCustomer(formData);
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const refreshUser = useCallback((updatedUser) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: { ...prev.user, ...updatedUser } };
      return next;
    });
  }, []);

  const value = {
    session,
    role: session?.role || null,
    user: session?.user || null,
    isAuthenticated: !!session,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
