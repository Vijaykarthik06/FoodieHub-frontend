import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  // If no order details, redirect to home after a delay
  React.useEffect(() => {
    if (!orderDetails) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="success-content">
            <div className="success-header">
              <div className="success-icon error">⚠️</div>
              <h1 className="success-title">Order Not Found</h1>
              <p className="success-subtitle">
                Redirecting you to home page...
              </p>
              <Link to="/" className="btn btn-primary">
                Go Home Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safely extract values with fallbacks
  const {
    orderId,
    orderNumber,
    items = [],
    restaurant = {},
    deliveryAddress = {},
    contactInfo = {},
    orderTotal,
    estimatedDelivery,
    paymentMethod = 'credit_card',
    tip = 0,
    // Backend response might have these fields directly
    subtotal,
    deliveryFee,
    tax
  } = orderDetails;

  // Calculate values safely
  const calculatedSubtotal = subtotal || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculatedTax = tax || (calculatedSubtotal * 0.08);
  const calculatedDeliveryFee = deliveryFee || (orderDetails.deliveryType === 'delivery' ? 2.99 : 0);
  const calculatedOrderTotal = orderTotal || (calculatedSubtotal + calculatedDeliveryFee + calculatedTax + parseFloat(tip || 0));

  // Safely format estimated delivery
  const formatEstimatedDelivery = () => {
    if (estimatedDelivery) {
      if (typeof estimatedDelivery === 'string') {
        return estimatedDelivery;
      } else if (estimatedDelivery instanceof Date) {
        return estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    // Fallback: 30 minutes from now
    return new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Safely format contact name
  const getContactName = () => {
    if (contactInfo.firstName && contactInfo.lastName) {
      return `₹{contactInfo.firstName} ₹{contactInfo.lastName}`;
    }
    if (contactInfo.name) {
      return contactInfo.name;
    }
    return 'Customer';
  };

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-header">
            <div className="success-icon">🎉</div>
            <h1 className="success-title">Order Confirmed!</h1>
            <p className="success-subtitle">
              Thank you for your order. We've sent a confirmation to {contactInfo.email || 'your email'}
            </p>
          </div>

          <div className="order-details-card">
            {/* Order Information */}
            <div className="order-info">
              <h3>Order Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Order Number:</span>
                  <span className="info-value">{orderNumber || 'Pending...'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order Date:</span>
                  <span className="info-value">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Estimated Delivery:</span>
                  <span className="info-value highlight">{formatEstimatedDelivery()}</span>
                </div>
                {orderId && (
                  <div className="info-item">
                    <span className="info-label">Order ID:</span>
                    <span className="info-value order-id">{orderId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="delivery-info">
              <h3>Delivery Information</h3>
              <div className="address-details">
                <p><strong>{getContactName()}</strong></p>
                {deliveryAddress.street && <p>{deliveryAddress.street}</p>}
                {deliveryAddress.city && deliveryAddress.state && (
                  <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}</p>
                )}
                {contactInfo.phone && <p>📱 {contactInfo.phone}</p>}
                {contactInfo.email && <p>✉️ {contactInfo.email}</p>}
                {deliveryAddress.instructions && (
                  <div className="instructions">
                    <strong>Delivery Instructions:</strong> 
                    <p>{deliveryAddress.instructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Restaurant Information */}
            {restaurant.name && (
              <div className="restaurant-info">
                <h3>Restaurant</h3>
                <div className="restaurant-details">
                  {restaurant.image && (
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name} 
                      className="restaurant-image" 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop';
                      }}
                    />
                  )}
                  <div className="restaurant-text">
                    <h4>{restaurant.name}</h4>
                    <p>{restaurant.cuisine || restaurant.tags?.join(', ') || 'Various Cuisines'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="order-items">
              <h3>Order Items</h3>
              <div className="items-list">
                {items.map((item, index) => (
                  <div key={`₹{item.id || item._id || index}-₹{index}`} className="order-item">
                    <div className="item-image">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1160&auto=format&fit=crop';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                      {item.specialInstructions && (
                        <p className="item-instructions">
                          <em>Note: {item.specialInstructions}</em>
                        </p>
                      )}
                      <p className="item-price">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{calculatedSubtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span>{calculatedDeliveryFee <= 0 ? 'FREE' : `₹${calculatedDeliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (8%):</span>
                  <span>₹{calculatedTax.toFixed(2)}</span>
                </div>
                {tip > 0 && (
                  <div className="summary-row">
                    <span>Tip:</span>
                    <span>₹{parseFloat(tip).toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total Paid:</span>
                  <span>₹{calculatedOrderTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Payment Method:</span>
                  <span className="payment-method">
                    {paymentMethod.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-actions">
            <Link to="/restaurants" className="btn btn-outline">
              Order Again
            </Link>
             <Link to="/orders" className="btn btn-outline">
              View Order History
            </Link>
            <button 
              onClick={() => window.print()} 
              className="btn btn-secondary"
            >
              Print Receipt
            </button>
          </div>

          {/* Order Tracking */}
          <div className="next-steps">
            <h3>Order Status</h3>
            <div className="steps">
              <div className="step active">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Order Confirmed</h4>
                  <p>We've received your order and are preparing it now</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Preparation</h4>
                  <p>The restaurant is preparing your food</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>On the Way</h4>
                  <p>Your driver is picking up your order</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Delivered</h4>
                  <p>Your food arrives at your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Information */}
          <div className="support-info">
            <h3>Need Help?</h3>
            <p>
              If you have any questions about your order, please contact our support team at{" "}
              <a href="tel:+1-555-ORDER-NOW">+1 (555) ORDER-NOW</a> or{" "}
              <a href="mailto:support@foodiehub.com">support@foodiehub.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;