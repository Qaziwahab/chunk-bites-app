import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }
  
  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return auth.user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
