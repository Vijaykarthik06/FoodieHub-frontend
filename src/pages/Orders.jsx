import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Orders.css';

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

    // Clean items array - remove any default or empty items
    const cleanedItems = (order.items || [])
      .filter(item => 
        item && 
        item._id && 
        item.name && 
        item.name !== 'Unknown Item' && 
        item.name !== 'Item' &&
        typeof item.price === 'number' && 
        item.price > 0 &&
        typeof item.quantity === 'number' && 
        item.quantity > 0
      )
      .map(item => ({
        _id: item._id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || null,
        specialInstructions: item.specialInstructions || '',
        category: item.category || '',
        description: item.description || ''
      }));

    // If no valid items, return null
    if (cleanedItems.length === 0) {
      console.log('No valid items in order, skipping:', order._id);
      return null;
    }

    // Clean restaurant data
    const cleanedRestaurant = {
      _id: order.restaurantId?._id || order.restaurantId || `rest_${Date.now()}`,
      name: order.restaurantName || 'Restaurant',
      image: order.restaurantImage || null,
      cuisine: order.restaurantId?.cuisine || '',
      address: order.restaurantId?.address || '',
      deliveryTime: order.restaurantId?.deliveryTime || '',
      rating: order.restaurantId?.rating || 0
    };

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
      _id: order._id || `order_${Date.now()}`,
      orderNumber: order.orderNumber || `ORD${Date.now()}`,
      status: order.status || 'pending',
      createdAt: order.createdAt || new Date().toISOString(),
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      items: cleanedItems,
      restaurantId: cleanedRestaurant,
      restaurantName: cleanedRestaurant.name,
      restaurantImage: cleanedRestaurant.image,
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

  // Function to add a new order to user's order history
  const addNewOrder = useCallback((newOrder) => {
    if (!user || !user.email) {
      console.error('No user logged in to add order');
      return;
    }

    console.log('Adding new order for user:', user.email, newOrder);

    // Validate and clean order data before adding
    const cleanedOrder = cleanOrderData(newOrder);
    
    if (!cleanedOrder) {
      console.error('Invalid order data - no valid items after cleaning');
      return;
    }

    // Ensure the order has the user's email
    cleanedOrder.userEmail = user.email;

    // Add to local state and remove duplicates
    setOrders(prevOrders => {
      const orderExists = prevOrders.some(order => 
        order._id === cleanedOrder._id || 
        order.orderNumber === cleanedOrder.orderNumber
      );
      
      if (orderExists) {
        // Update existing order
        return prevOrders.map(order => 
          order._id === cleanedOrder._id ? cleanedOrder : order
        );
      } else {
        // Add new order at the beginning
        return [cleanedOrder, ...prevOrders];
      }
    });
    
    // Update localStorage cache
    updateLocalStorageOrders(user.email, cleanedOrder);
    
    console.log('Successfully added order to history:', cleanedOrder._id);
  }, [user, cleanOrderData]);

  // Helper function to update localStorage
  const updateLocalStorageOrders = useCallback((userEmail, newOrder) => {
    const storageKey = `userOrders_${userEmail}`;
    const savedOrders = localStorage.getItem(storageKey);
    let existingOrders = [];

    if (savedOrders) {
      try {
        existingOrders = JSON.parse(savedOrders);
        
        // Remove existing order if present (to avoid duplicates)
        const filteredOrders = existingOrders.filter(order => 
          order._id !== newOrder._id && 
          order.orderNumber !== newOrder.orderNumber
        );
        
        const updatedOrders = [newOrder, ...filteredOrders];
        localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
        console.log('Updated localStorage with new order for:', userEmail);
      } catch (e) {
        console.error('Error updating cached orders:', e);
        localStorage.setItem(storageKey, JSON.stringify([newOrder]));
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify([newOrder]));
    }
  }, []);

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
      
      // Use the actual backend API
      const response = await ordersAPI.getMyOrders();
      
      if (response.data.success) {
        const fetchedOrders = (response.data.orders || [])
          .map(order => cleanOrderData(order))
          .filter(order => order !== null && order.items.length > 0);
        
        console.log('Fetched and cleaned orders from API:', fetchedOrders.length);
        setOrders(fetchedOrders);
        
        // Also cache in localStorage as backup
        localStorage.setItem(`userOrders_${user.email}`, JSON.stringify(fetchedOrders));
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders from API:', error);
      
      // Fallback to localStorage cache
      try {
        const cachedOrders = orderUtils.getCachedOrders(user.email);
        const cleanedCachedOrders = cachedOrders
          .map(order => cleanOrderData(order))
          .filter(order => order !== null && order.items.length > 0);
        
        console.log('Loaded and cleaned orders from cache:', cleanedCachedOrders.length);
        setOrders(cleanedCachedOrders);
        
        if (cleanedCachedOrders.length > 0) {
          setError('Using cached data - unable to connect to server');
        } else {
          setError('No orders found. Please check your connection and try again.');
        }
      } catch (cacheError) {
        console.error('Error loading cached orders:', cacheError);
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, cleanOrderData]);

  // Clean existing orders on component mount
  useEffect(() => {
    if (user?.email) {
      const cachedOrders = orderUtils.getCachedOrders(user.email);
      const cleanedOrders = cachedOrders
        .map(order => cleanOrderData(order))
        .filter(order => order !== null && order.items.length > 0);
      
      if (cleanedOrders.length > 0) {
        localStorage.setItem(`userOrders_${user.email}`, JSON.stringify(cleanedOrders));
        console.log('Cleaned existing cached orders:', cleanedOrders.length);
      }
    }
  }, [user, cleanOrderData]);

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
    
    if (user?.email) {
      fetchUserOrders();
    } else {
      setLoading(false);
      setError('Please login to view your orders');
    }

    // Event listener for new orders from checkout/order success
    const handleNewOrder = (event) => {
      if (event.detail && event.detail.type === 'NEW_ORDER' && user?.email) {
        console.log('Received new order event:', event.detail.order);
        const cleanedOrder = cleanOrderData(event.detail.order);
        if (cleanedOrder && cleanedOrder.items.length > 0) {
          // Ensure the order has the correct email
          cleanedOrder.userEmail = user.email;
          addNewOrder(cleanedOrder);
          setSuccessMessage('New order placed successfully!');
          
          // Clear success message after 5 seconds
          setTimeout(() => setSuccessMessage(''), 5000);
        } else {
          console.error('Invalid order data received in event');
        }
      }
    };

    // Event listener for order updates from admin
    const handleOrderUpdate = (event) => {
      if (event.detail && event.detail.type === 'ORDER_UPDATED' && user?.email) {
        const updatedOrder = cleanOrderData(event.detail.order);
        if (updatedOrder && updatedOrder.items.length > 0) {
          console.log('Received order update:', updatedOrder);
          // Ensure the order has the correct email
          updatedOrder.userEmail = user.email;
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order._id === updatedOrder._id ? updatedOrder : order
            )
          );
          
          // Update cache
          updateLocalStorageOrders(user.email, updatedOrder);
        }
      }
    };

    window.addEventListener('newOrder', handleNewOrder);
    window.addEventListener('orderUpdated', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('newOrder', handleNewOrder);
      window.removeEventListener('orderUpdated', handleOrderUpdate);
    };
  }, [location, user, fetchUserOrders, addNewOrder, cleanOrderData, updateLocalStorageOrders]);

  // Real-time synchronization
  useEffect(() => {
    if (!user?.email) return;

    // Sync orders every 30 seconds when on orders page
    const syncInterval = setInterval(() => {
      fetchUserOrders();
    }, 30000);

    // Also sync when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUserOrders();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(syncInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, fetchUserOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await ordersAPI.cancel(orderId);
      
      if (response.data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
        
        setSuccessMessage('Order cancelled successfully');
        
        // Update cache
        if (user?.email) {
          const cachedOrders = orderUtils.getCachedOrders(user.email);
          const updatedOrders = cachedOrders.map(order => 
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          );
          localStorage.setItem(`userOrders_${user.email}`, JSON.stringify(updatedOrders));
        }

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('orderUpdated', {
          detail: { 
            type: 'ORDER_UPDATED', 
            order: { _id: orderId, status: 'cancelled' }
          }
        }));
      } else {
        throw new Error(response.data.message);
      }
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
        _id: order.restaurantId?._id || order.restaurantId,
        name: order.restaurantName,
        image: order.restaurantImage,
        cuisine: order.restaurantId?.cuisine,
        deliveryTime: order.restaurantId?.deliveryTime,
        rating: order.restaurantId?.rating
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
    localStorage.setItem('reorderRestaurantId', order.restaurantId?._id || order.restaurantId);
    
    // Navigate to restaurant page
    const restaurantId = order.restaurantId?._id || order.restaurantId;
    if (restaurantId) {
      navigate(`/restaurant/${restaurantId}?reorder=true`);
    } else {
      setError('Cannot reorder: Restaurant information missing');
    }
  };

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

  // Calculate subtotal safely
  const calculateSubtotal = (order) => {
    if (order.subtotal) return order.subtotal;
    
    return order.items?.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0) || 0;
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
        
        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
            <button 
              className="alert-close" 
              onClick={() => setSuccessMessage('')}
            >
              ×
            </button>
          </div>
        )}
        
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
              <div key={order._id || order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">
                      Order {order.orderNumber || `#${(order._id || '').slice(-8).toUpperCase()}`}
                    </h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                    <div className="restaurant-info">
                      {order.restaurantImage && (
                        <img 
                          src={order.restaurantImage} 
                          alt={order.restaurantName}
                          className="restaurant-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="restaurant-details">
                        <h4>{order.restaurantName}</h4>
                        <p>{order.restaurantId?.cuisine || 'Various Cuisines'}</p>
                        {order.restaurantId?.address && (
                          <p className="restaurant-address">{order.restaurantId.address}</p>
                        )}
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
                    {order.cancelledAt && (
                      <p className="cancelled-time">
                        Cancelled: {formatDate(order.cancelledAt)}
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
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="item-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            {item.description && (
                              <span className="item-description">{item.description}</span>
                            )}
                            {item.specialInstructions && (
                              <span className="item-instructions">
                                Note: {item.specialInstructions}
                              </span>
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
                      {order.deliveryAddress?.instructions && (
                        <p className="delivery-instructions">
                          <strong>Delivery Instructions:</strong> {order.deliveryAddress.instructions}
                        </p>
                      )}
                      {order.deliveryType && (
                        <p className="delivery-type">
                          <strong>Delivery Type:</strong> {order.deliveryType}
                        </p>
                      )}
                    </div>
                    
                    <div className="order-totals">
                      <h4>Order Summary:</h4>
                      <div className="total-row">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal(order).toFixed(2)}</span>
                      </div>
                      {(order.deliveryFee || 0) > 0 && (
                        <div className="total-row">
                          <span>Delivery Fee:</span>
                          <span>${(order.deliveryFee || 0).toFixed(2)}</span>
                        </div>
                      )}
                      {(order.tax || 0) > 0 && (
                        <div className="total-row">
                          <span>Tax:</span>
                          <span>${(order.tax || 0).toFixed(2)}</span>
                        </div>
                      )}
                      {(order.serviceFee || 0) > 0 && (
                        <div className="total-row">
                          <span>Service Fee:</span>
                          <span>${(order.serviceFee || 0).toFixed(2)}</span>
                        </div>
                      )}
                      {(order.tip || order.tipAmount || 0) > 0 && (
                        <div className="total-row">
                          <span>Tip:</span>
                          <span>${(order.tip || order.tipAmount || 0).toFixed(2)}</span>
                        </div>
                      )}
                      {order.discountAmount > 0 && (
                        <div className="total-row discount">
                          <span>Discount:</span>
                          <span>-${(order.discountAmount || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="total-row final-total">
                        <span>Total:</span>
                        <span>${calculateOrderTotal(order).toFixed(2)}</span>
                      </div>
                      <div className="payment-method">
                        <span>Payment: </span>
                        <span>{(order.paymentMethod || 'unknown').replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                      {order.paymentStatus && (
                        <div className="payment-status">
                          <span>Payment Status: </span>
                          <span className={`status-${order.paymentStatus}`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      )}
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
                        navigate(`/rate-order/${order._id}`);
                      }}
                    >
                      ⭐ Rate Order
                    </button>
                  )}
                  
                  {order.status === 'delivered' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        navigate(`/help/order/${order._id}`);
                      }}
                    >
                      🆘 Get Help
                    </button>
                  )}
                  
                  <button 
                    className="btn btn-outline"
                    onClick={() => {
                      // Download receipt
                      const receiptData = {
                        orderId: order._id,
                        orderNumber: order.orderNumber,
                        date: order.createdAt,
                        restaurant: order.restaurantName,
                        items: order.items,
                        total: calculateOrderTotal(order),
                        address: formatAddress(order.deliveryAddress)
                      };
                      localStorage.setItem('receiptData', JSON.stringify(receiptData));
                      window.open(`/receipt/${order._id}`, '_blank');
                    }}
                  >
                    🧾 Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Export functions to be used by other components
export const orderUtils = {
  addNewOrder: (userEmail, newOrder) => {
    if (!userEmail) {
      console.error('User email required to save order');
      return;
    }

    // Clean the order data before saving
    const cleanOrderData = (order) => {
      if (!order) return null;

      const cleanedItems = (order.items || [])
        .filter(item => 
          item && 
          item._id && 
          item.name && 
          item.name !== 'Unknown Item' && 
          item.name !== 'Item' &&
          typeof item.price === 'number' && 
          item.price > 0 &&
          typeof item.quantity === 'number' && 
          item.quantity > 0
        )
        .map(item => ({
          _id: item._id,
          name: item.name,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image: item.image || null,
          specialInstructions: item.specialInstructions || '',
          category: item.category || ''
        }));

      if (cleanedItems.length === 0) return null;

      return {
        ...order,
        items: cleanedItems,
        restaurantName: order.restaurantName || 'Restaurant',
        totalAmount: Number(order.totalAmount) || 0,
        orderTotal: Number(order.orderTotal) || 0,
        userEmail: userEmail // Ensure email is always included
      };
    };

    const cleanedOrder = cleanOrderData(newOrder);
    if (!cleanedOrder) {
      console.error('Invalid order data - no valid items');
      return;
    }

    const storageKey = `userOrders_${userEmail}`;
    const existingOrders = orderUtils.getCachedOrders(userEmail);
    
    // Remove duplicates and add new order
    const filteredOrders = existingOrders.filter(order => 
      order._id !== cleanedOrder._id && 
      order.orderNumber !== cleanedOrder.orderNumber
    );
    
    const updatedOrders = [cleanedOrder, ...filteredOrders];
    localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
    
    console.log('Order saved to localStorage for:', userEmail);
    
    // Dispatch event to update any open Orders components
    window.dispatchEvent(new CustomEvent('newOrder', {
      detail: { 
        type: 'NEW_ORDER', 
        order: cleanedOrder,
        timestamp: new Date().toISOString()
      }
    }));
  },

  getCachedOrders: (userEmail) => {
    if (!userEmail) return [];
    
    try {
      const cachedOrders = localStorage.getItem(`userOrders_${userEmail}`);
      if (!cachedOrders) return [];
      
      const orders = JSON.parse(cachedOrders);
      // Filter out orders with no valid items AND ensure they belong to the correct email
      return orders.filter(order => 
        order && 
        order.items && 
        order.items.length > 0 &&
        order.items.some(item => item && item._id && item.name && item.name !== 'Unknown Item' && item.name !== 'Item') &&
        order.userEmail === userEmail // Only return orders for this specific email
      );
    } catch (error) {
      console.error('Error getting cached orders:', error);
      return [];
    }
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
  },

  // New function to sync orders from multiple sources
  syncUserOrders: async (userEmail) => {
    if (!userEmail) return [];
    
    try {
      // Get cached orders
      const cachedOrders = orderUtils.getCachedOrders(userEmail);
      
      // Try to fetch from API
      try {
        const response = await ordersAPI.getMyOrders();
        if (response.data.success) {
          const apiOrders = (response.data.orders || [])
            .filter(order => 
              order && 
              order.items && 
              order.items.length > 0 &&
              order.items.some(item => item && item._id && item.name && item.name !== 'Unknown Item' && item.name !== 'Item')
            )
            .map(order => ({ ...order, userEmail })); // Ensure email is included
            
          // Merge and remove duplicates
          const allOrders = [...apiOrders];
          cachedOrders.forEach(cachedOrder => {
            const exists = allOrders.some(apiOrder => 
              apiOrder._id === cachedOrder._id || 
              apiOrder.orderNumber === cachedOrder.orderNumber
            );
            if (!exists) {
              allOrders.push(cachedOrder);
            }
          });
          
          // Save merged list
          localStorage.setItem(`userOrders_${userEmail}`, JSON.stringify(allOrders));
          return allOrders;
        }
      } catch (apiError) {
        console.error('API sync failed, using cache:', apiError);
      }
      
      return cachedOrders;
    } catch (error) {
      console.error('Error syncing orders:', error);
      return [];
    }
  }
};

export default Orders;