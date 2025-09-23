import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();  // expect cartItems array from context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ✅ Safe calculation for cart items
  const cartItemsCount =
    (cartItems && Array.isArray(cartItems))
      ? cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-icon">🍔</span>
          FoodieHub
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/menu" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Menu
          </Link>
          <Link to="/restaurants" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Restaurants
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Orders
              </Link>
              <button className="nav-link btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </>
          )}

          <Link to="/cart" className="nav-cart" onClick={() => setIsMenuOpen(false)}>
            🛒 Cart
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </Link>
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
