import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const STORAGE_KEY = 'flux-user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = useCallback((email, password) => {
    // Dummy auth: any email/password works. Admin if email ends with @admin.com
    const isAdmin = /@admin\.com$/i.test(email);
    const nameGuess = email.split('@')[0].replace(/\W+/g, ' ').trim() || 'User';
    const nextUser = { name: nameGuess, email, isAdmin };
    setUser(nextUser);
    return nextUser;
  }, []);

  const signup = useCallback((name, email, password) => {
    const isAdmin = /@admin\.com$/i.test(email);
    const displayName = name?.trim() || email.split('@')[0];
    const nextUser = { name: displayName, email, isAdmin };
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: !!user, isAdmin: !!user?.isAdmin, login, signup, logout }), [user, login, signup, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


