'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, password_confirmation: string, role?: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuth();
    }
  }, [mounted]);

  const checkAuth = async () => {
    console.log('🔍 AuthProvider: Starting auth check...');
    
    // Only run on client side
    if (typeof window === 'undefined') {
      console.log('🔍 AuthProvider: Server side, skipping auth check');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      console.log('🔍 AuthProvider: Token exists:', !!token);
      console.log('🔍 AuthProvider: Saved user exists:', !!savedUser);
      
      if (token) {
        // Update token storage to be consistent
        localStorage.setItem('auth_token', token);
        localStorage.removeItem('token'); // Remove old token key if it exists
        
        // First try to use saved user if available
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log('🔍 AuthProvider: Using saved user:', parsedUser.email);
            setUser(parsedUser);
          } catch (e) {
            console.log('🔍 AuthProvider: Failed to parse saved user, will fetch from API');
          }
        }
        
        // Verify with API
        console.log('🔍 AuthProvider: Verifying token with API...');
        const response = await api.get('/user');
        console.log('🔍 AuthProvider: API response:', response.data);
        
        // Handle the response structure: {success: true, data: user}
        let userData;
        if (response.data.success && response.data.data) {
          userData = response.data.data;
        } else {
          userData = response.data.user || response.data;
        }
        
        console.log('🔍 AuthProvider: Setting user data:', userData.email);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.log('🔍 AuthProvider: No token found');
      }
    } catch (error) {
      console.error('❌ AuthProvider: Auth check failed', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      console.log('🔍 AuthProvider: Auth check complete, setting loading to false');
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔑 AuthProvider: Starting login for:', email);
    try {
      const response = await api.post('/login', { email, password });
      console.log('🔑 AuthProvider: Login response:', response.data);
      
      // Handle the response structure from the backend
      let token, user;
      if (response.data.success && response.data.data) {
        token = response.data.data.token;
        user = response.data.data.user;
      } else {
        // Fallback for other response structures
        token = response.data.token;
        user = response.data.user;
      }
      
      console.log('🔑 AuthProvider: Extracted token exists:', !!token);
      console.log('🔑 AuthProvider: Extracted user:', user?.email);
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Logged in successfully!');
      console.log('✅ AuthProvider: Login successful');
      return user; // Return user data for role-based redirect
    } catch (error: any) {
      console.error('❌ AuthProvider: Login error', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string, role: string = 'user') => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation,
        role,
      });
      
      // Handle the response structure from the backend
      let token, user;
      if (response.data.success && response.data.data) {
        token = response.data.data.token;
        user = response.data.data.user;
      } else {
        // Fallback for other response structures
        token = response.data.token;
        user = response.data.user;
      }
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Account created successfully!');
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let message = 'Registration failed';
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = Object.values(error.response.data.errors).flat();
        message = `Validation failed:\n${errors.join('\n')}`;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
