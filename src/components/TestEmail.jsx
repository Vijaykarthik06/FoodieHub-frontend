import React, { useState } from 'react';

const TestEmail = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testEmailService = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/test-email-service');
      const data = await response.json();
      setResult(data);
      console.log('Email test result:', data);
    } catch (err) {
      setError(err.message);
      console.error('Email test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickTestEmail = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/quick-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setResult(data);
      console.log('Quick email test result:', data);
    } catch (err) {
      setError(err.message);
      console.error('Quick email test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📧 Email Service Test</h1>
      <p>Test if emails are being sent to vijaykarthik2512@gmail.com</p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={testEmailService}
          disabled={loading}
          style={{ 
            marginRight: '10px', 
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Test Full Email Service
        </button>
        
        <button 
          onClick={quickTestEmail}
          disabled={loading}
          style={{ 
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Quick Test Email
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p>Sending test emails...</p>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {error && (
        <div style={{ 
          background: '#ffebee', 
          padding: '20px', 
          margin: '20px 0', 
          borderRadius: '8px',
          borderLeft: '5px solid #c62828'
        }}>
          <h3 style={{ color: '#c62828', marginTop: 0 }}>❌ Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ 
          background: result.success ? '#e8f5e8' : '#fff3cd', 
          padding: '20px', 
          margin: '20px 0', 
          borderRadius: '8px',
          borderLeft: `5px solid ${result.success ? '#28a745' : '#ffc107'}`
        }}>
          <h3 style={{ 
            color: result.success ? '#2e7d32' : '#856404',
            marginTop: 0 
          }}>
            {result.success ? '✅ Success!' : '⚠️ Result:'}
          </h3>
          <p><strong>Message:</strong> {result.message}</p>
          {result.details && <p><strong>Details:</strong> {result.details}</p>}
          {result.orderNumber && <p><strong>Test Order Number:</strong> {result.orderNumber}</p>}
          {result.timestamp && <p><strong>Time:</strong> {new Date(result.timestamp).toLocaleString()}</p>}
          
          {result.emailConfig && (
            <div style={{ 
              marginTop: '15px', 
              padding: '15px', 
              background: 'white', 
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}>
              <h4 style={{ marginTop: 0 }}>Email Configuration:</h4>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li><strong>From Email:</strong> {result.emailConfig.from || 'Not set'}</li>
                <li><strong>Admin Email:</strong> {result.emailConfig.adminEmail || 'Not set'}</li>
                <li><strong>Configured:</strong> {result.emailConfig.configured ? '✅ Yes' : '❌ No'}</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        background: '#f5f5f5', 
        padding: '25px', 
        borderRadius: '10px',
        border: '1px solid #ddd'
      }}>
        <h3>📋 Instructions:</h3>
        <ol>
          <li><strong>First, configure your .env file:</strong>
            <ul>
              <li><code>EMAIL_USER=vijaykarthik2512@gmail.com</code></li>
              <li><code>EMAIL_PASSWORD=your-app-specific-password</code> (Get from Google App Passwords)</li>
              <li><code>EMAIL_ADMIN=vijaykarthik2512@gmail.com</code></li>
            </ul>
          </li>
          <li><strong>Click "Quick Test Email"</strong> to send a test order notification to vijaykarthik2512@gmail.com</li>
          <li><strong>Click "Test Full Email Service"</strong> to test both customer and admin emails</li>
          <li><strong>Check your email inbox</strong> (and spam folder) for test emails</li>
          <li><strong>When placing real orders</strong>, both customer and admin will receive emails automatically</li>
        </ol>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#e3f2fd', 
          borderRadius: '8px',
          borderLeft: '4px solid #2196f3'
        }}>
          <h4 style={{ marginTop: 0 }}>🔑 Getting Google App Password:</h4>
          <ol style={{ margin: '10px 0' }}>
            <li>Go to <a href="https://myaccount.google.com/" target="_blank" rel="noopener noreferrer">Google Account</a></li>
            <li>Click "Security"</li>
            <li>Enable "2-Step Verification" if not already enabled</li>
            <li>Under "Signing in to Google", click "App passwords"</li>
            <li>Select "Mail" and "Other (Custom name)" - name it "FoodieHub"</li>
            <li>Copy the 16-character password and use it as EMAIL_PASSWORD</li>
          </ol>
        </div>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <strong>Endpoints:</strong><br/>
          • <code>GET /api/test-email-service</code> - Full email service test<br/>
          • <code>POST /api/quick-test-email</code> - Quick admin email test<br/>
          • <code>POST /api/orders/create</code> - Creates order and sends emails automatically
        </p>
      </div>
    </div>
  );
};

export default TestEmail;