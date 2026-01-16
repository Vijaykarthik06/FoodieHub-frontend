import React, { useState } from 'react';
import { orderService } from '../services/orderService';

const DebugOrder = () => {
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    setStatus('Testing database connection...');
    try {
      const result = await orderService.testDatabase();
      setResult(result);
      setStatus(`Database connected: ${result.isConnected}`);
      console.log('Database test result:', result);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.error('Database test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestOrder = async () => {
    setLoading(true);
    setStatus('Creating test order...');
    try {
      const testOrder = {
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

      const response = await orderService.createOrder(testOrder);
      setResult(response);
      setStatus('Test order created successfully!');
      console.log('Test order result:', response);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.error('Test order error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Order Debug Tool</h1>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={testDatabase}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Test Database
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
      
      {status && (
        <div style={{ 
          background: status.includes('Error') ? '#ffebee' : '#e8f5e8',
          padding: '15px',
          margin: '15px 0',
          borderRadius: '5px'
        }}>
          <h3>{status.includes('Error') ? '❌ Error' : '✅ Status'}</h3>
          <p>{status}</p>
        </div>
      )}

      {result && (
        <div style={{ 
          background: '#f5f5f5',
          padding: '15px',
          margin: '15px 0',
          borderRadius: '5px',
          overflowX: 'auto'
        }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: '30px', background: '#e3f2fd', padding: '20px', borderRadius: '5px' }}>
        <h3>Debug Information:</h3>
        <p><strong>Current Time:</strong> {new Date().toISOString()}</p>
        <p><strong>Backend URL:</strong> http://localhost:5000</p>
        <p><strong>Order Endpoint:</strong> http://localhost:5000/api/orders/create</p>
        <p><strong>Check your browser console for detailed logs</strong></p>
      </div>
    </div>
  );
};

export default DebugOrder;