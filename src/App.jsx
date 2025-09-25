import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import DevHelper from './components/DevHelper';
import ErrorBoundary from './components/ErrorBoundary';
import { PerformanceWrapper, PerformancePanel } from './utils/performanceMonitor';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Admin = lazy(() => import('./pages/Admin'));
const Products = lazy(() => import('./pages/Products'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card glass-card p-5 text-center">
          <div className="loading mb-3"></div>
          <h3 className="gradient-text">Loading...</h3>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <div className="bg-animation"></div>
              <ErrorBoundary>
                <PerformanceWrapper id="Navbar">
                  <Navbar />
                </PerformanceWrapper>
              </ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="Home">
                        <Home />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/product/:id" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="ProductDetails">
                        <ProductDetails />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/wishlist" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="Wishlist">
                        <Wishlist />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/products" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="Products">
                        <Products />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/cart" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="Cart">
                        <Cart />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/checkout" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="Checkout">
                        <Checkout />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/thankyou" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="ThankYou">
                        <ThankYou />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/login" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="Login">
                        <Login />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/signup" element={
                    <ErrorBoundary>
                      <PerformanceWrapper id="Signup">
                        <Signup />
                      </PerformanceWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                      <ErrorBoundary>
                        <PerformanceWrapper id="Admin">
                          <Admin />
                        </PerformanceWrapper>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } />
                </Routes>
              </Suspense>
              <DevHelper />
              <PerformancePanel />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
