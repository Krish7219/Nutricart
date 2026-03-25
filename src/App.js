import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Menu from './pages/Menu';
import MealDetail from './pages/MealDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import ContactUs from './pages/ContactUs';
import VendorDashboard from './pages/VendorDashboard';
import Influencers from './pages/Influencers';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ErrorBoundary>
          <Box minH="100vh">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="menu" element={<Menu />} />
              <Route path="menu/:mealId" element={<MealDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="influencers" element={<Influencers />} />
              
              {/* Protected Routes */}
              <Route path="onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="order-confirmation" element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="vendor-dashboard" element={
                <ProtectedRoute>
                  <VendorDashboard />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
          <Chatbot />
          </Box>
        </ErrorBoundary>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
