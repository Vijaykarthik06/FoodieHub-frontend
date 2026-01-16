import React, { useState } from 'react';

const DebugDatabase = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testDatabase = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/debug/db');
      const data = await response.json();
      setResult(data);
      console.log('Database test result:', data);
    } catch (err) {
      setError(err.message);
      console.error('Database test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTestOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const testOrder = {
        userEmail: 'test@example.com',
        restaurantId: 'test_restaurant_123',
        restaurantName: 'Test Restaurant',
        restaurantImage: 'https://test.com/image.jpg',
        items: [{
          name: 'Test Item',
          price: 10.99,
          quantity: 2,
          image: '',
          specialInstructions: 'Test instructions'
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
        paymentMethod: 'credit_card',
        deliveryType: 'delivery',
        subtotal: 21.98,
        deliveryFee: 2.99,
        tax: 1.76,
        tip: 3.00,
        total: 29.73,
        specialInstructions: 'Test order'
      };

      const response = await fetch('http://localhost:5000/api/debug/create-test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testOrder)
      });
      
      const data = await response.json();
      setResult(data);
      console.log('Test order result:', data);
    } catch (err) {
      setError(err.message);
      console.error('Test order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Database Debug Tool</h1>
      
      <div style={{ margin: '20px 0' }}>
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
          style={{ padding: '10px 20px' }}
        >
          Create Test Order
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ background: '#ffebee', padding: '15px', margin: '15px 0', borderRadius: '5px' }}>
          <h3 style={{ color: '#c62828' }}>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ background: '#e8f5e8', padding: '15px', margin: '15px 0', borderRadius: '5px' }}>
          <h3 style={{ color: '#2e7d32' }}>Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', background: '#f5f5f5', padding: '20px', borderRadius: '5px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Click "Test Database Connection" to check if MongoDB is connected</li>
          <li>If connection is successful, click "Create Test Order" to test order saving</li>
          <li>Check your backend console for detailed logs</li>
          <li>Check MongoDB Compass to see if orders are saved</li>
        </ol>
        
        <p><strong>Backend URL:</strong> http://localhost:5000</p>
        <p><strong>Database Status Endpoint:</strong> http://localhost:5000/api/debug/db</p>
        <p><strong>Test Order Endpoint:</strong> http://localhost:5000/api/debug/create-test-order</p>
      </div>
    </div>
  );
};

export default DebugDatabase;