import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Use Render Backend URL
const API_URL = 'http://localhost:5000/api';

  // ✅ Test backend connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing backend connection...');
        const response = await fetch(`${API_URL}/api/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        console.log('✅ Backend health check:', response.status);
      } catch (err) {
        console.error('❌ Backend connection failed:', err.message);
      }
    };
    
    testConnection();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      console.log('🔐 Logging in →', `${API_URL}/api/auth/login`);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📨 Login response status:', response.status);

      // Try to read as text first for debugging
      const responseText = await response.text();
      console.log('📨 Login response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        throw new Error('Server returned invalid response');
      }

      console.log('📨 Login parsed data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setError('');
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }

    } catch (error) {
      console.error('🔴 Login error:', error);
      
      let errorMessage;
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = `Cannot connect to backend server. Please check:
        1. The backend URL: ${API_URL}
        2. The backend is running
        3. CORS is configured on backend
        4. Network connection`;
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      console.log('📝 Registering →', `${API_URL}/api/auth/register`);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log('📨 Registration response status:', response.status);

      // Try to read as text first for debugging
      const responseText = await response.text();
      console.log('📨 Registration response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        throw new Error('Server returned invalid response');
      }

      console.log('📨 Registration parsed data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Registration failed with status ${response.status}`);
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setError('');
        return data;
      } else {
        throw new Error(data.message || 'Registration failed');
      }

    } catch (error) {
      console.error('🔴 Registration error:', error);
      
      let errorMessage;
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = `Cannot connect to backend server. Please check:
        1. The backend URL: ${API_URL}
        2. The backend is running
        3. CORS is configured on backend
        4. Network connection
        
        Try testing: ${API_URL}/api/health`;
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError: clearError,
    API_URL // Export for testing
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};