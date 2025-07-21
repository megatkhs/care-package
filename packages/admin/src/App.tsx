import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage, { dashboardLoader } from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import StoresPage, { storesLoader } from './pages/StoresPage';
import UsersPage, { usersLoader } from './pages/UsersPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
        loader: dashboardLoader,
      },
      {
        path: 'users',
        element: <UsersPage />,
        loader: usersLoader,
      },
      {
        path: 'stores',
        element: <StoresPage />,
        loader: storesLoader,
      },
      {
        path: 'settings',
        element: (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">設定</h1>
            <p className="text-gray-600 mt-2">設定画面は開発中です</p>
          </div>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
