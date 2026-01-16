import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import GeneralMenu from './pages/GeneralMenu';
import Restaurants from './pages/Restaurants';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import OrderSuccess from './pages/OrderSuccess';
import ScrollToTop from './components/ScrollToTop';
import './App.css';
import axios from 'axios';
import DebugDatabase from './components/DebugDatabase';
import DebugCheckout from './components/DebugCheckout';
import TestEmail from './components/TestEmail';




function App() {
  return (
    // REMOVED basename completely for development
    <BrowserRouter>
      <ScrollToTop />

      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<GeneralMenu />} />
                <Route path="/menu/:restaurantId" element={<Menu />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/debug-checkout" element={<DebugCheckout />} />
                <Route path="/debug-db" element={<DebugDatabase />} />
                <Route path="/test-email" element={<TestEmail />} />


                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="*"
                  element={
                    <div className="page-not-found">
                      <h2>404 - Page Not Found</h2>
                      <p>The page you're looking for doesn't exist.</p>
                    </div>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;