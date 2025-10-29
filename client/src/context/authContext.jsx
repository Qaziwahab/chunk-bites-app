import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data);
      localStorage.setItem('auth', JSON.stringify(data));
      toast.success('Logged in successfully!');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setAuth(data);
      localStorage.setItem('auth', JSON.stringify(data));
      toast.success('Registered successfully!');
      return data;
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('auth');
    toast.success('Logged out.');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
