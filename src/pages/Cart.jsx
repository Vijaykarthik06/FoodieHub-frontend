import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import './Cart.css';

const Cart = () => {
  const { cartItems, getCartTotal, clearCart, restaurant } = useCart();
  const { user } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Your Cart</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>
        
        {restaurant && (
          <div className="cart-restaurant-info">
            <h3>Ordering from: {restaurant.name}</h3>
            <p>{restaurant.cuisine}</p>
          </div>
        )}
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
            
            <button onClick={clearCart} className="btn-clear-cart">
              Clear Cart
            </button>
          </div>
          
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            {user ? (
              <Link to="/checkout" className="btn btn-primary btn-checkout">
  Proceed to Checkout
</Link>
            ) : (
              <div className="login-prompt">
                <p>Please log in to complete your order</p>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              </div>
            )}
            
            <Link to="/restaurants" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;