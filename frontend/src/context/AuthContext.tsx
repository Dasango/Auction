import React, { createContext, useContext, useState } from 'react';
import { api } from '../lib/api';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('decky_token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('decky_user_id'));

  const login = async (username: string, password: string) => {
    const jwtToken = await api.auth.login({ username, password });
    
    // The API Gateway extracts userId from JWT and adds it to headers for backend services.
    // In the frontend, we store the username as the userId since that's what the backend expects in X-User-Id.
    // In a more complex setup, we would decode the JWT to get the 'sub' claim.
    
    localStorage.setItem('decky_token', jwtToken);
    localStorage.setItem('decky_user_id', username);
    setToken(jwtToken);
    setUserId(username);
  };

  const signup = async (username: string, password: string) => {
    await api.auth.signup({ username, password });
  };

  const logout = () => {
    localStorage.removeItem('decky_token');
    localStorage.removeItem('decky_user_id');
    setToken(null);
    setUserId(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, userId, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
