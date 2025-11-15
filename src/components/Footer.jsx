import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="logo-icon">🍔</span>
              FoodieHub
            </h3>
            <p className="footer-description">
              Delivering delicious food to your doorstep. Order from your favorite restaurants with just a few clicks.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/restaurants">Restaurants</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">Orders</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-links">
              <li>📞 +91 7667360699</li>
              <li>✉️ support@foodiehub.com</li>
              <li>🏠 123 Food Street, Tasty City</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FoodieHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;