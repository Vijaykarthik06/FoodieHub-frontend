import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const OrderDebug = () => {
  const { apiUrl } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const testBackend = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();
      setResult({ type: 'health', data, status: response.status });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const testOrder = {
        userEmail: 'test@example.com',
        restaurantId: 'test_restaurant',
        restaurantName: 'Test Restaurant',
        restaurantImage: '',
        items: [{
          name: 'Test Item',
          price: 10.99,
          quantity: 2,
          image: '',
          specialInstructions: 'Test'
        }],
        deliveryAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          instructions: ''
        },
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890'
        },
        paymentMethod: 'cash',
        deliveryType: 'delivery',
        subtotal: 21.98,
        deliveryFee: 2.99,
        tax: 1.76,
        tip: 3.00,
        total: 29.73,
        specialInstructions: 'Test order'
      };

      const response = await fetch(`${apiUrl}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testOrder)
      });
      
      const data = await response.json();
      setResult({ type: 'order', data, status: response.status });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Order Debug Tool</h1>
      <p>API URL: {apiUrl}</p>
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={testBackend} disabled={loading} style={{ marginRight: '10px' }}>
          Test Backend
        </button>
        <button onClick={testOrder} disabled={loading}>
          Test Order
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ background: '#ffebee', padding: '15px', borderRadius: '5px' }}>
          <h3 style={{ color: '#c62828' }}>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
          <h3 style={{ color: '#2e7d32' }}>Result:</h3>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Type:</strong> {result.type}</p>
          <pre style={{ background: 'white', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OrderDebug;