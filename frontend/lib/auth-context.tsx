'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuthStatus, logoutUser, getCurrentUser, getCartCount } from './api';

interface User {
  id: number;
  name: string;
  email: string;
  phone_no: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isOwner: boolean;
  cartCount: number;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  updateCartCount: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateCartCount = () => {
    if (user && user.role === 'customer') {
      const count = getCartCount();
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsLoggedIn(true);
    setIsOwner(userData.role === 'owner');
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    updateCartCount();
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setIsOwner(false);
      setCartCount(0);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      // First check localStorage
      const storedUser = getCurrentUser();
      if (!storedUser) {
        setLoading(false);
        return;
      }

      // Verify with server
      const authStatus = await checkAuthStatus();
      if (authStatus && authStatus.user) {
        setUser(storedUser);
        setIsLoggedIn(true);
        setIsOwner(storedUser.role === 'owner');
        updateCartCount();
      } else {
        // Server says not authenticated, clear local storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          localStorage.removeItem('foodCourtCart');
        }
        setUser(null);
        setIsLoggedIn(false);
        setIsOwner(false);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear auth state on error
      setUser(null);
      setIsLoggedIn(false);
      setIsOwner(false);
      setCartCount(0);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('foodCourtCart');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    // Listen for cart changes
    const handleCartChange = () => {
      updateCartCount();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('authChange', handleAuthChange);
      window.addEventListener('cartChange', handleCartChange);

      return () => {
        window.removeEventListener('authChange', handleAuthChange);
        window.removeEventListener('cartChange', handleCartChange);
      };
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isOwner,
    cartCount,
    loading,
    login,
    logout,
    updateCartCount,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
