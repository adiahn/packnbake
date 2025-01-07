import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import StoreFront from './components/StoreFront';
import Dashboard from './components/admin/Dashboard';
import Login from './components/admin/Login';
import { ToastProvider } from './contexts/ToastContext';
import ProductGallery from './components/ProductGallery';
import ProductManager from './components/admin/ProductManager';
import OrderManager from './components/admin/OrderManager';
import Analytics from './components/admin/Analytics';
import Reviews from './components/Reviews';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<StoreFront />} />
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin/*" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
