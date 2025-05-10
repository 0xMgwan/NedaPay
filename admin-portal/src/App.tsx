import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { Web3Provider } from './contexts/Web3Context';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Reserves from './pages/Reserves';
import Transactions from './pages/Transactions';
import KycManagement from './pages/KycManagement';
import MintBurn from './pages/MintBurn';
import RoleManagement from './pages/RoleManagement';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <>
      <CssBaseline />
      <Web3Provider>
        <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
        
        {/* Protected dashboard routes */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="reserves" element={<Reserves />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="kyc" element={<KycManagement />} />
          <Route path="mint-burn" element={<MintBurn />} />
          <Route path="role-management" element={<RoleManagement />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Web3Provider>
    </>
  );
}

export default App;
