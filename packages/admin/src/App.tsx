import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import StoresPage from './pages/StoresPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* パブリックルート */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 保護されたルート */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="stores" element={<StoresPage />} />
            <Route path="settings" element={
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900">設定</h1>
                <p className="text-gray-600 mt-2">設定画面は開発中です</p>
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;