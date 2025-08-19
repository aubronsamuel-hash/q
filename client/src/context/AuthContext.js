import React, { createContext, useContext, useState } from 'react';

// Context to share authentication state across the app
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Perform login by storing token and user information
  const login = (tokenValue, userInfo) => {
    setToken(tokenValue);
    setUser(userInfo);
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userInfo));
  };

  // Clear auth data on logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook to use auth context
export const useAuth = () => useContext(AuthContext);
