import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Orders.css';

// Define orderUtils FIRST to avoid reference errors
const orderUtils = {
  getCachedOrders: (userEmail) => {
    if (!userEmail) return [];
    
    try {
      const storageKey = `userOrders_${userEmail}`;
      const cachedOrders = localStorage.getItem(storageKey);
      console.log('Getting cached orders for:', userEmail, 'from key:', storageKey);
      
      if (!cachedOrders) {
        console.log('No cached orders found for:', userEmail);
        return [];
      }
      
      const orders = JSON.parse(cachedOrders);
      console.log('Found cached orders:', orders.length, 'for:', userEmail);
      
      // Return all orders for this email, even if they have issues (we'll clean them later)
      return orders.filter(order => order && order.userEmail === userEmail);
    } catch (error) {
      console.error('Error getting cached orders:', error);
      return [];
    }
  },

  addNewOrder: (userEmail, newOrder) => {
    if (!userEmail) {
      console.error('User email required to save order');
      return;
    }

    console.log('Saving new order for:', userEmail, newOrder);

    // Ensure the order has the user's email
    const orderWithEmail = {
      ...newOrder,
      userEmail: userEmail
    };

    const storageKey = `userOrders_${userEmail}`;
    const existingOrders = orderUtils.getCachedOrders(userEmail);
    
    // Check if order already exists
    const orderExists = existingOrders.some(order => 
      order._id === orderWithEmail._id || 
      order.orderNumber === orderWithEmail.orderNumber
    );
    
    if (!orderExists) {
      // Add new order at the beginning
      const updatedOrders = [orderWithEmail, ...existingOrders];
      localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
      console.log('Order saved successfully for:', userEmail);
    } else {
      // Update existing order
      const updatedOrders = existingOrders.map(order => 
        order._id === orderWithEmail._id ? orderWithEmail : order
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
      console.log('Order updated successfully for:', userEmail);
    }
    
    // Dispatch event to update any open Orders components
    window.dispatchEvent(new CustomEvent('newOrder', {
      detail: { 
        type: 'NEW_ORDER', 
        order: orderWithEmail,
        timestamp: new Date().toISOString()
      }
    }));
  },

  // Function to initialize with sample orders for testing
  initializeSampleOrders: (userEmail) => {
    if (!userEmail) return;
    
    const existingOrders = orderUtils.getCachedOrders(userEmail);
    if (existingOrders.length > 0) {
      console.log('User already has orders, skipping sample data');
      return;
    }

    const sampleOrders = [
      {
        _id: 'order_sample_1',
        orderNumber: 'ORD001',
        status: 'delivered',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        items: [
          {
            _id: 'item1',
            name: 'Margherita Pizza',
            price: 12.99,
            quantity: 1,
            image: null,
            category: 'Pizza'
          },
          {
            _id: 'item2',
            name: 'Garlic Bread',
            price: 4.99,
            quantity: 2,
            image: null,
            category: 'Appetizer'
          }
        ],
        restaurantName: 'Pizza Palace',
        restaurantImage: null,
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        deliveryFee: 2.99,
        tax: 1.87,
        tip: 3.00,
        totalAmount: 25.84,
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        userEmail: userEmail
      },
      {
        _id: 'order_sample_2',
        orderNumber: 'ORD002',
        status: 'preparing',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
        items: [
          {
            _id: 'item3',
            name: 'Chicken Burger',
            price: 9.99,
            quantity: 1,
            image: null,
            category: 'Burger'
          },
          {
            _id: 'item4',
            name: 'French Fries',
            price: 3.99,
            quantity: 1,
            image: null,
            category: 'Sides'
          }
        ],
        restaurantName: 'Burger Corner',
        restaurantImage: null,
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        deliveryFee: 1.99,
        tax: 1.20,
        tip: 2.00,
        totalAmount: 19.17,
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        userEmail: userEmail
      }
    ];

    localStorage.setItem(`userOrders_${userEmail}`, JSON.stringify(sampleOrders));
    console.log('Sample orders initialized for:', userEmail);
  },

  updateOrderStatus: (userEmail, orderId, newStatus) => {
    if (!userEmail || !orderId) return false;
    
    try {
      const storageKey = `userOrders_${userEmail}`;
      const cachedOrders = orderUtils.getCachedOrders(userEmail);
      
      if (cachedOrders.length > 0) {
        const updatedOrders = cachedOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        
        localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
        
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('orderUpdated', {
          detail: { 
            type: 'ORDER_UPDATED', 
            order: { _id: orderId, status: newStatus }
          }
        }));
        
        return true;
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
    
    return false;
  },

  clearUserOrders: (userEmail) => {
    if (!userEmail) return;
    
    try {
      localStorage.removeItem(`userOrders_${userEmail}`);
      console.log('Cleared orders for user:', userEmail);
    } catch (error) {
      console.error('Error clearing user orders:', error);
    }
  }
};

const Orders = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Function to clean and validate order data
  const cleanOrderData = useCallback((order) => {
    if (!order) return null;

    // Clean items array - be more lenient with validation
    const cleanedItems = (order.items || [])
      .filter(item => item && item.name) // Only require name
      .map(item => ({
        _id: item._id || `item_${Math.random().toString(36).substr(2, 9)}`,
        name: item.name || 'Unknown Item',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || null,
        specialInstructions: item.specialInstructions || '',
        category: item.category || '',
        description: item.description || ''
      }));

    // If no items, create a default item to prevent losing the order
    if (cleanedItems.length === 0) {
      cleanedItems.push({
        _id: `default_item_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Various Items',
        price: order.totalAmount || 0,
        quantity: 1,
        image: null,
        category: 'General',
        description: 'Order details'
      });
    }

    // Clean restaurant data
    const restaurantName = order.restaurantName || 'Various Restaurants';
    const restaurantImage = order.restaurantImage || null;

    // Clean delivery address
    const cleanedAddress = order.deliveryAddress && typeof order.deliveryAddress === 'object' 
      ? {
          street: order.deliveryAddress.street || '',
          city: order.deliveryAddress.city || '',
          state: order.deliveryAddress.state || '',
          zipCode: order.deliveryAddress.zipCode || '',
          area: order.deliveryAddress.area || '',
          instructions: order.deliveryAddress.instructions || ''
        }
      : {};

    return {
      _id: order._id || `order_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: order.orderNumber || `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: order.status || 'pending',
      createdAt: order.createdAt || new Date().toISOString(),
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      items: cleanedItems,
      restaurantName: restaurantName,
      restaurantImage: restaurantImage,
      deliveryAddress: cleanedAddress,
      deliveryType: order.deliveryType || 'delivery',
      deliveryFee: Number(order.deliveryFee) || 0,
      tax: Number(order.tax) || 0,
      serviceFee: Number(order.serviceFee) || 0,
      tip: Number(order.tip || order.tipAmount) || 0,
      discountAmount: Number(order.discountAmount) || 0,
      totalAmount: Number(order.totalAmount) || 0,
      orderTotal: Number(order.orderTotal) || 0,
      subtotal: Number(order.subtotal) || 0,
      paymentMethod: order.paymentMethod || 'credit_card',
      paymentStatus: order.paymentStatus || 'completed',
      rated: order.rated || false,
      userEmail: order.userEmail || user?.email // Ensure email is always included
    };
  }, [user]);

  const fetchUserOrders = useCallback(async () => {
    if (!user?.email) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching orders for user:', user.email);
      
      // Try to fetch from API first
      try {
        const response = await ordersAPI.getMyOrders();
        
        if (response.data && response.data.success) {
          const fetchedOrders = (response.data.orders || [])
            .map(order => cleanOrderData(order))
            .filter(order => order !== null);
          
          console.log('Fetched orders from API:', fetchedOrders.length);
          setOrders(fetchedOrders);
          
          // Cache the orders
          localStorage.setItem(`userOrders_${user.email}`, JSON.stringify(fetchedOrders));
        } else {
          throw new Error('Failed to fetch orders from API');
        }
      } catch (apiError) {
        console.error('API Error, using cache:', apiError);
        throw apiError; // Re-throw to trigger cache fallback
      }
    } catch (error) {
      console.error('Error fetching orders from API, using cache:', error);
      
      // Fallback to localStorage cache
      try {
        // Initialize sample orders if no orders exist (for testing)
        const cachedOrders = orderUtils.getCachedOrders(user.email);
        
        if (cachedOrders.length === 0) {
          console.log('No orders found, initializing sample orders for:', user.email);
          orderUtils.initializeSampleOrders(user.email);
        }
        
        const finalCachedOrders = orderUtils.getCachedOrders(user.email);
        const cleanedCachedOrders = finalCachedOrders
          .map(order => cleanOrderData(order))
          .filter(order => order !== null);
        
        console.log('Loaded orders from cache:', cleanedCachedOrders.length, 'for:', user.email);
        setOrders(cleanedCachedOrders);
        
        if (cleanedCachedOrders.length > 0) {
          setError('Using cached data - unable to connect to server');
        } else {
          setError('No orders found. Place your first order to see it here!');
        }
      } catch (cacheError) {
        console.error('Error loading cached orders:', cacheError);
        setError('Failed to load orders. Please try again.');
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, cleanOrderData]);

  // Load orders when component mounts or user changes
  useEffect(() => {
    if (user?.email) {
      console.log('User logged in, loading orders for:', user.email);
      fetchUserOrders();
    } else {
      setLoading(false);
      setError('Please login to view your orders');
      setOrders([]);
    }
  }, [user, fetchUserOrders]);

  // Check for new orders from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
      setTimeout(() => setSuccessMessage(''), 5000);
    }

    if (location.state?.newOrder) {
      console.log('Received new order from navigation:', location.state.newOrder);
      const cleanedOrder = cleanOrderData(location.state.newOrder);
      if (cleanedOrder) {
        // Ensure the order has the correct email
        cleanedOrder.userEmail = user.email;
        orderUtils.addNewOrder(user.email, cleanedOrder);
        setOrders(prev => [cleanedOrder, ...prev]);
        setSuccessMessage('New order placed successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    }
  }, [location, user, cleanOrderData]);

  // Event listener for new orders
  useEffect(() => {
    const handleNewOrder = (event) => {
      if (event.detail && event.detail.type === 'NEW_ORDER' && user?.email) {
        console.log('Received new order event:', event.detail.order);
        const cleanedOrder = cleanOrderData(event.detail.order);
        if (cleanedOrder) {
          // Ensure the order has the correct email
          cleanedOrder.userEmail = user.email;
          orderUtils.addNewOrder(user.email, cleanedOrder);
          setOrders(prev => [cleanedOrder, ...prev]);
          setSuccessMessage('New order placed successfully!');
          setTimeout(() => setSuccessMessage(''), 5000);
        }
      }
    };

    window.addEventListener('newOrder', handleNewOrder);
    return () => window.removeEventListener('newOrder', handleNewOrder);
  }, [user, cleanOrderData]);

  // Debug: Log current orders state
  useEffect(() => {
    console.log('Current orders state:', orders);
  }, [orders]);

  // Rest of your component functions remain the same (handleCancelOrder, handleReorder, etc.)
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setLoading(true);
      
      // For demo purposes, we'll just update locally
      // In real app, you would call: const response = await ordersAPI.cancel(orderId);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      
      setSuccessMessage('Order cancelled successfully');
      
      // Update cache using orderUtils
      if (user?.email) {
        orderUtils.updateOrderStatus(user.email, orderId, 'cancelled');
      }

      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('orderUpdated', {
        detail: { 
          type: 'ORDER_UPDATED', 
          order: { _id: orderId, status: 'cancelled' }
        }
      }));
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError(error.response?.data?.message || error.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) {
      setError('Cannot reorder: No valid items in this order');
      return;
    }

    // Store order items in localStorage for reordering
    const reorderData = {
      restaurant: {
        name: order.restaurantName,
      },
      items: order.items.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        specialInstructions: item.specialInstructions,
        category: item.category
      })),
      timestamp: new Date().toISOString(),
      originalOrderId: order._id
    };
    
    localStorage.setItem('reorderData', JSON.stringify(reorderData));
    
    // Navigate to restaurants page with reorder flag
    navigate('/restaurants?reorder=true');
  };

  // ... (Keep all your existing helper functions: getStatusColor, getStatusText, formatDate, formatAddress, etc.)

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'preparing':
      case 'confirmed':
        return 'status-preparing';
      case 'ready':
        return 'status-ready';
      case 'out_for_delivery':
        return 'status-ontheway';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Order Placed',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready for Pickup',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return 'No address provided';
    
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zipCode) parts.push(address.zipCode);
    if (address.area) parts.push(address.area);
    
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  const canCancelOrder = (order) => {
    const nonCancellableStatuses = ['delivered', 'cancelled', 'out_for_delivery', 'ready'];
    return !nonCancellableStatuses.includes(order.status);
  };

  const canRateOrder = (order) => {
    return order.status === 'delivered' && !order.rated;
  };

  // Calculate order statistics for filters
  const orderStats = {
    all: orders.length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  // Filter orders based on status
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate)
  );

  // Calculate order total safely
  const calculateOrderTotal = (order) => {
    if (order.totalAmount) return order.totalAmount;
    if (order.orderTotal) return order.orderTotal;
    
    // Calculate from items
    const itemsTotal = order.items?.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0) || 0;
    
    const deliveryFee = order.deliveryFee || 0;
    const tip = order.tip || order.tipAmount || 0;
    const tax = order.tax || 0;
    const serviceFee = order.serviceFee || 0;
    
    return itemsTotal + deliveryFee + tip + tax + serviceFee;
  };

  // Force refresh orders
  const handleForceRefresh = () => {
    fetchUserOrders();
  };

  // Filter orders to only show those that belong to the current user's email
  const userSpecificOrders = orders.filter(order => 
    order.userEmail === user?.email
  );

  if (!user) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="no-orders">
            <div className="no-orders-icon">🔒</div>
            <h2>Login Required</h2>
            <p>Please log in to view your order history.</p>
            <Link to="/login" className="btn btn-primary">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading && userSpecificOrders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <div className="header-content">
            <h1 className="page-title">Your Orders</h1>
            <p className="page-subtitle">Order history for: {user.email}</p>
            <p className="page-info">
              Total orders: {userSpecificOrders.length} | 
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="orders-header-actions">
            <button 
              className="btn btn-outline refresh-btn"
              onClick={handleForceRefresh}
              disabled={loading}
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh Orders'}
            </button>
          </div>
        </div>
        
        {/* Order Filters */}
        <div className="order-filters">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Orders ({orderStats.all})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({orderStats.pending})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmed ({orderStats.confirmed})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'preparing' ? 'active' : ''}`}
            onClick={() => setFilterStatus('preparing')}
          >
            Preparing ({orderStats.preparing})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'out_for_delivery' ? 'active' : ''}`}
            onClick={() => setFilterStatus('out_for_delivery')}
          >
            On the Way ({orderStats.out_for_delivery})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilterStatus('delivered')}
          >
            Delivered ({orderStats.delivered})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled ({orderStats.cancelled})
          </button>
        </div>
        
        {sortedOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No orders found</h2>
            <p>
              {filterStatus === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : `No ${filterStatus.replace(/_/g, ' ')} orders found.`
              }
            </p>
            {filterStatus !== 'all' && (
              <button 
                className="btn btn-outline"
                onClick={() => setFilterStatus('all')}
              >
                View All Orders
              </button>
            )}
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {sortedOrders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">
                      Order {order.orderNumber}
                    </h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                    <div className="restaurant-info">
                      <div className="restaurant-details">
                        <h4>{order.restaurantName}</h4>
                        <p>Various Cuisines</p>
                      </div>
                    </div>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <p className="estimated-delivery">
                        Est. delivery: {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                    {order.deliveredAt && (
                      <p className="delivered-time">
                        Delivered: {formatDate(order.deliveredAt)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="order-details">
                  <div className="order-items">
                    <h4>Order Items ({order.items.length}):</h4>
                    <div className="items-grid">
                      {order.items.map((item, index) => (
                        <div key={`${item._id}-${index}`} className="order-item-detail">
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            {item.description && (
                              <span className="item-description">{item.description}</span>
                            )}
                          </div>
                          <div className="item-meta">
                            <span className="item-quantity">x{item.quantity}</span>
                            <span className="item-price">
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="order-meta">
                    <div className="order-address">
                      <h4>Delivery Address:</h4>
                      <p>{formatAddress(order.deliveryAddress)}</p>
                    </div>
                    
                    <div className="order-totals">
                      <h4>Order Summary:</h4>
                      <div className="total-row final-total">
                        <span>Total:</span>
                        <span>${calculateOrderTotal(order).toFixed(2)}</span>
                      </div>
                      <div className="payment-method">
                        <span>Payment: </span>
                        <span>{(order.paymentMethod || 'credit card').replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleReorder(order)}
                    disabled={order.items.length === 0}
                  >
                    📋 Reorder
                  </button>
                  
                  {canCancelOrder(order) && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={loading}
                    >
                      {loading ? 'Cancelling...' : '❌ Cancel Order'}
                    </button>
                  )}
                  
                  {canRateOrder(order) && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        // navigate(`/rate-order/${order._id}`);
                        setSuccessMessage('Rating feature coming soon!');
                      }}
                    >
                      ⭐ Rate Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
export { orderUtils };