import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/api/authApi';

interface User {
  id: string;
  rollNumber: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  sendOTP: (rollNumber: string, phone: string) => Promise<void>;
  verifyOTP: (rollNumber: string, otp: string) => Promise<{ status: string }>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const data = await authApi.verify();
      setUser(data.user);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (rollNumber: string, phone: string) => {
    await authApi.sendOTP(rollNumber, phone);
  };

  const verifyOTP = async (rollNumber: string, otp: string) => {
    const data = await authApi.verifyOTP(rollNumber, otp);

    if ('token' in data) {
      // Existing user - login successful
      const authData = data as any;
      localStorage.setItem('token', authData.token);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
      setToken(authData.token);
      setUser(authData.user);
      return { status: 'existing_user' };
    } else {
      // New user - registration needed
      return { status: 'new_user' };
    }
  };

  const register = async (payload: any) => {
    const data = await authApi.register(payload);
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    sendOTP,
    verifyOTP,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};