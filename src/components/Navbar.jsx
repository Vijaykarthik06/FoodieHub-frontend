import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // ⬅️ use NavLink
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
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
        <NavLink to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-icon">🍔</span>
          FoodieHub
        </NavLink>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/menu" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Menu
          </NavLink>
          <NavLink to="/restaurants" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Restaurants
          </NavLink>

          {user ? (
            <>
              <NavLink to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Profile
              </NavLink>
              <NavLink to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Orders
              </NavLink>
              <button className="nav-link btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Register
              </NavLink>
            </>
          )}

          <NavLink to="/cart" className="nav-cart" onClick={() => setIsMenuOpen(false)}>
            🛒 Cart
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </NavLink>
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
