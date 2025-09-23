import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user orders
    const fetchOrders = () => {
      // Mock data
      const mockOrders = [
        {
          id: 'ORD-12345',
          date: '2023-05-15',
          status: 'delivered',
          items: [
            { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
            { name: 'Garlic Bread', quantity: 1, price: 4.99 }
          ],
          total: 19.42,
          deliveryAddress: '123 Main St, Anytown, AN 12345'
        },
        {
          id: 'ORD-12346',
          date: '2023-05-10',
          status: 'preparing',
          items: [
            { name: 'Burger Deluxe', quantity: 2, price: 9.99 },
            { name: 'French Fries', quantity: 1, price: 3.99 }
          ],
          total: 26.95,
          deliveryAddress: '123 Main St, Anytown, AN 12345'
        },
        {
          id: 'ORD-12347',
          date: '2023-05-05',
          status: 'delivered',
          items: [
            { name: 'Caesar Salad', quantity: 1, price: 8.99 },
            { name: 'Chocolate Cake', quantity: 1, price: 5.99 }
          ],
          total: 16.42,
          deliveryAddress: '123 Main St, Anytown, AN 12345'
        }
      ];

      setOrders(mockOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'preparing':
        return 'status-preparing';
      case 'on-the-way':
        return 'status-ontheway';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order.id}</h3>
                    <p className="order-date">Placed on {order.date}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="order-details">
                  <div className="order-items">
                    <h4>Items:</h4>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.name} - ${item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="order-address">
                    <h4>Delivery Address:</h4>
                    <p>{order.deliveryAddress}</p>
                  </div>
                  
                  <div className="order-total">
                    <h4>Total:</h4>
                    <p>${order.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button className="btn btn-outline">Reorder</button>
                  <button className="btn btn-outline">View Details</button>
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