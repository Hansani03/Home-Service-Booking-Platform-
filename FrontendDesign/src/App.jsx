import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/auth/AuthPage';
import NotFound from './pages/NotFound';

import CustomerHome from './pages/customer/CustomerHome';
import ServicesBrowse from './pages/customer/ServicesBrowse';
import SearchResults from './pages/customer/SearchResults';
import ProviderProfile from './pages/customer/ProviderProfile';
import BookingDetails from './pages/customer/BookingDetails';
import PaymentGateway from './pages/customer/PaymentGateway';
import MyBookings from './pages/customer/MyBookings';
import BookingView from './pages/customer/BookingView';
import RateProvider from './pages/customer/RateProvider';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderProfileEdit from './pages/provider/ProviderProfileEdit';
import ProviderBookings from './pages/provider/ProviderBookings';
import ProviderBookingDetails from './pages/provider/ProviderBookingDetails';

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <LandingPage />;
  return <Navigate to={role === 'Provider' ? '/provider/home' : '/customer/home'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route element={<AppLayout />}>
              {/* Customer routes */}
              <Route
                path="/customer/home"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <CustomerHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/services"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <ServicesBrowse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/search"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <SearchResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/providers/:id"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <ProviderProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/book/:providerId"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/payment/:bookingId"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <PaymentGateway />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/bookings"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/bookings/:id"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <BookingView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/bookings/:id/rate"
                element={
                  <ProtectedRoute allowedRole="Customer">
                    <RateProvider />
                  </ProtectedRoute>
                }
              />

              {/* Provider routes */}
              <Route
                path="/provider/home"
                element={
                  <ProtectedRoute allowedRole="Provider">
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/profile"
                element={
                  <ProtectedRoute allowedRole="Provider">
                    <ProviderProfileEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/bookings"
                element={
                  <ProtectedRoute allowedRole="Provider">
                    <ProviderBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/bookings/:id"
                element={
                  <ProtectedRoute allowedRole="Provider">
                    <ProviderBookingDetails />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
