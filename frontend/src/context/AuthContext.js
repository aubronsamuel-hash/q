import React, { createContext, useState } from 'react';

// Authentication context exposes current user, token and setter
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage to persist login across refreshes
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Helper to update auth state and localStorage
  const setAuth = ({ token: newToken, user: newUser }) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
    setToken(newToken || null);
    setUser(newUser || null);
  };

  // Helper to clear auth state
  const logout = () => setAuth({});

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
