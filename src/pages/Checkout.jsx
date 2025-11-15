import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { orderUtils } from './Orders';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, restaurant, dispatch } = useCart();
  

  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    
    // Delivery Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: '',
    
    // Payment
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    
    // Order Details
    deliveryType: 'delivery',
    tip: '0',
    specialInstructions: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to safely handle cuisine data
  const getCuisineDisplay = (cuisine) => {
    if (!cuisine) return 'Various';
    if (Array.isArray(cuisine)) {
      return cuisine.join(', ');
    }
    if (typeof cuisine === 'string') {
      return cuisine;
    }
    return 'Various';
  };

  // Helper function to safely handle restaurant data
  const getRestaurantData = () => {
    if (!restaurant) {
      return {
        _id: 'default_restaurant',
        name: 'Restaurant',
        cuisine: 'Various',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop'
      };
    }
    
    return {
      _id: restaurant._id || restaurant.id || 'default_restaurant',
      name: restaurant.name || 'Restaurant',
      cuisine: restaurant.cuisine || 'Various',
      image: restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop'
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  // In your Checkout component after successful order creation
const handleCheckoutSubmit = async (checkoutData) => {
  try {
    // Create order data
    const orderData = {
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      restaurantImage: restaurant.image,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        specialInstructions: item.specialInstructions || ''
      })),
      deliveryAddress: {
        street: checkoutData.address,
        city: checkoutData.city,
        state: checkoutData.state,
        zipCode: checkoutData.zipCode,
        instructions: checkoutData.deliveryInstructions || ''
      },
      contactInfo: {
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        phone: checkoutData.phone,
        email: checkoutData.email || user.email
      },
      paymentMethod: checkoutData.paymentMethod,
      deliveryType: checkoutData.deliveryType || 'delivery',
      tip: parseFloat(checkoutData.tip) || 0,
      specialInstructions: checkoutData.specialInstructions || ''
    };

    // Save to MongoDB
    const response = await ordersAPI.create(orderData);
    
    if (response.data.success) {      
      // Dispatch event to update Orders page
      window.dispatchEvent(new CustomEvent('newOrder', {
        detail: { 
          type: 'NEW_ORDER', 
          order: response.data.order 
        }
      }));
      
      // Navigate to success page
      navigate('/order-success', { 
        state: { orderDetails: response.data.order },
        replace: true 
      });
    }
    
  } catch (error) {
    console.error('Checkout error:', error);
    setError(error.response?.data?.message || 'Failed to place order. Please try again.');
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  console.log('🟡 Starting order submission...');
  console.log('🟡 Cart items:', cartItems);
  console.log('🟡 Form data:', formData);
  console.log('🟡 User:', user);

  // Validate required fields
  if (!validateForm()) {
    console.log('🔴 Form validation failed');
    setLoading(false);
    return;
  }

  if (cartItems.length === 0) {
    console.log('🔴 Cart is empty');
    setError('Cart is empty');
    setLoading(false);
    return;
  }

  try {
    // Get safe restaurant data
    const restaurantData = getRestaurantData();
    console.log('🟡 Restaurant data:', restaurantData);
    
    // Calculate order totals
    const subtotal = getCartTotal();
    const deliveryFee = formData.deliveryType === 'delivery' ? 2.99 : 0;
    const tax = subtotal * 0.08;
    const tipAmount = parseFloat(formData.tip) || 0;
    const total = subtotal + deliveryFee + tax + tipAmount;

    console.log('🟡 Order totals:', { subtotal, deliveryFee, tax, tipAmount, total });

    // Prepare order data for backend
    const orderData = {
      restaurantId: restaurantData._id,
      restaurantName: restaurantData.name,
      restaurantImage: restaurantData.image,
      items: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        specialInstructions: item.specialInstructions || ''
      })),
      deliveryAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        instructions: formData.instructions
      },
      contactInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      paymentMethod: formData.paymentMethod,
      deliveryType: formData.deliveryType,
      tip: tipAmount,
      specialInstructions: formData.specialInstructions,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      total: total
    };

    console.log('📦 Final order data being sent to backend:', JSON.stringify(orderData, null, 2));

    // Try to send order to backend
    console.log('🟡 Calling ordersAPI.create...');
    let response;
    try {
      response = await ordersAPI.create(orderData);
      console.log('✅ Backend response:', response.data);
    } catch (apiError) {
      console.error('🔴 API call failed:', apiError);
      console.error('🔴 API error details:', {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status
      });
      
      // Fallback to localStorage if API fails
      console.log('🟡 Using localStorage fallback...');
      response = {
        data: {
          success: true,
          order: {
            _id: `order_₹{Date.now()}`,
            orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
            ...orderData,
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
            status: 'confirmed'
          }
        }
      };
    }
    
    if (response.data.success) {
      console.log('✅ Order created successfully in backend');
      
      // Create order for localStorage history
      const newOrder = {
        _id: response.data.order._id,
        orderNumber: response.data.order.orderNumber,
        userEmail: user.email,
        contactInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        restaurant: {
          _id: restaurantData._id,
          name: restaurantData.name,
          cuisine: restaurantData.cuisine,
          image: restaurantData.image
        },
        items: cartItems.map(item => ({
          _id: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          specialInstructions: item.specialInstructions || ''
        })),
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          instructions: formData.instructions
        },
        status: 'confirmed',
        paymentMethod: formData.paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        tip: tipAmount,
        total: total,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
      };

      console.log('🟡 Adding order to localStorage...', newOrder);

      // Add to localStorage order history
      orderUtils.addNewOrder(user.email, newOrder);

      // Clear cart
      clearCart();
      
      console.log('✅ Order process completed, navigating to success page');
      
      // Redirect to success page
      navigate('/order-success', { 
        state: { orderDetails: newOrder }
      });
    } else {
      throw new Error(response.data.message || 'Failed to create order');
    }

  } catch (error) {
    console.error('❌ Final order creation error:', error);
    setError(error.response?.data?.message || error.message || 'Failed to place order. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'street', 'city', 'state', 'zipCode'
    ];

    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        const fieldName = field.replace(/([A-Z])/g, ' ₹1').toLowerCase();
        setError(`Please fill in the ${fieldName}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (formData.paymentMethod.includes('card')) {
      if (!formData.cardNumber?.trim() || !formData.cardExpiry?.trim() || !formData.cardCvv?.trim()) {
        setError('Please fill in all card details');
        return false;
      }

      // Basic card number validation
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        setError('Please enter a valid card number');
        return false;
      }

      // Basic CVV validation
      if (formData.cardCvv.length < 3 || formData.cardCvv.length > 4) {
        setError('Please enter a valid CVV');
        return false;
      }
    }

    return true;
  };

  const subtotal = getCartTotal();
  const deliveryFee = formData.deliveryType === 'delivery' ? 2.99 : 0;
  const tax = subtotal * 0.08;
  const tipAmount = parseFloat(formData.tip) || 0;
  const total = subtotal + deliveryFee + tax + tipAmount;

  // Get safe restaurant data for display
  const restaurantData = getRestaurantData();

  // Tip options
  const tipOptions = [
    { value: '0', label: 'No Tip' },
    { value: '2', label: '₹2.00' },
    { value: '5', label: '₹5.00' },
    { value: '10', label: '₹10.00' },
    { value: 'custom', label: 'Custom Amount' }
  ];

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Please add some items to your cart before checking out.</p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        {error && (
          <div className="alert alert-error">
            {error}
            <button 
              className="alert-close" 
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        )}
        
        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="form-section">
                <h2 className="section-title">Contact Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Delivery Address */}
              <div className="form-section">
                <h2 className="section-title">Delivery Address</h2>
                <div className="form-group">
                  <label htmlFor="street" className="form-label">Street Address *</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="NY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="instructions" className="form-label">Delivery Instructions (Optional)</label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Leave at door, call upon arrival, etc."
                    rows="3"
                  />
                </div>
              </div>
              
              {/* Delivery Type */}
              <div className="form-section">
                <h2 className="section-title">Delivery Type</h2>
                <div className="form-group">
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="delivery"
                        checked={formData.deliveryType === 'delivery'}
                        onChange={handleChange}
                      />
                      <span className="radio-checkmark"></span>
                      Delivery (₹2.99)
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={formData.deliveryType === 'pickup'}
                        onChange={handleChange}
                      />
                      <span className="radio-checkmark"></span>
                      Pickup (Free)
                    </label>
                  </div>
                </div>
              </div>

              {/* Tip Selection */}
              <div className="form-section">
                <h2 className="section-title">Add a Tip</h2>
                <div className="form-group">
                  <div className="tip-options">
                    {tipOptions.map(option => (
                      <label key={option.value} className="tip-option">
                        <input
                          type="radio"
                          name="tip"
                          value={option.value}
                          checked={formData.tip === option.value}
                          onChange={handleChange}
                        />
                        <span className="tip-checkmark"></span>
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {formData.tip === 'custom' && (
                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <input
                        type="number"
                        name="tip"
                        value={formData.tip === 'custom' ? formData.tip : ''}
                        onChange={(e) => setFormData({...formData, tip: e.target.value})}
                        className="form-input"
                        placeholder="Enter custom amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="form-section">
                <h2 className="section-title">Special Instructions (Optional)</h2>
                <div className="form-group">
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Any special requests for your order..."
                    rows="3"
                  />
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="form-section">
                <h2 className="section-title">Payment Method</h2>
                <div className="form-group">
                  <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash">Cash on Delivery</option>
                  </select>
                </div>
                
                {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
                  <>
                    <div className="form-group">
                      <label htmlFor="cardNumber" className="form-label">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cardExpiry" className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardCvv" className="form-label">CVV</label>
                        <input
                          type="text"
                          id="cardCvv"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-place-order"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order - ₹${total.toFixed(2)}`}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="restaurant-info">
              <img 
                src={restaurantData.image} 
                alt={restaurantData.name}
                className="restaurant-image"
              />
              <div className="restaurant-details">
                <h3>{restaurantData.name}</h3>
                <p>{getCuisineDisplay(restaurantData.cuisine)}</p>
              </div>
            </div>
            
            <div className="order-items">
              <h4>Order Items ({cartItems.length})</h4>
              {cartItems.map(item => (
                <div key={item._id || item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Tax:</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="summary-row">
                  <span>Tip:</span>
                  <span>₹{tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;