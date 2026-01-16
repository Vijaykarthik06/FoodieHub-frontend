import React, { useState } from 'react';
import axios from 'axios';

const DebugCheckout = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/debug/db');
      setResult(response.data);
      console.log('Database debug result:', response.data);
    } catch (err) {
      setError(err.message);
      console.error('Database debug error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTestOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/debug/create-test-order');
      setResult(response.data);
      console.log('Test order result:', response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error('Test order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testRealOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        userEmail: 'test@example.com',
        restaurantId: 'restaurant_123',
        restaurantName: 'Test Restaurant',
        restaurantImage: 'https://test.com/image.jpg',
        items: [
          {
            name: 'Test Pizza',
            price: 12.99,
            quantity: 1,
            image: '',
            specialInstructions: 'Extra cheese'
          }
        ],
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Leave at door'
        },
        contactInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          phone: '1234567890'
        },
        paymentMethod: 'credit_card',
        deliveryType: 'delivery',
        subtotal: 12.99,
        deliveryFee: 2.99,
        tax: 1.04,
        tip: 2.00,
        total: 19.02,
        specialInstructions: 'Test order'
      };

      const response = await axios.post('http://localhost:5000/api/orders/create', orderData);
      setResult(response.data);
      console.log('Real order result:', response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error('Real order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Database & Order Debug</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testDatabase}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Test Database Connection
        </button>
        
        <button 
          onClick={createTestOrder}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Create Test Order
        </button>
        
        <button 
          onClick={testRealOrder}
          disabled={loading}
          style={{ padding: '10px 20px' }}
        >
          Create Real Order
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ background: '#ffebee', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
          <h3 style={{ color: '#c62828' }}>Error:</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div style={{ background: '#e8f5e8', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
          <h3 style={{ color: '#2e7d32' }}>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: '30px', background: '#f5f5f5', padding: '20px', borderRadius: '5px' }}>
        <h3>Debug Information:</h3>
        <p><strong>API Base URL:</strong> http://localhost:5000</p>
        <p><strong>Available Endpoints:</strong></p>
        <ul>
          <li>GET /api/debug/db - Test database connection</li>
          <li>POST /api/debug/create-test-order - Create test order</li>
          <li>POST /api/orders/create - Create real order</li>
          <li>GET /api/health - Health check</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugCheckout;