// AuthContext.jsx - FIXED VERSION
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// ✅ FIX: Ensure API_URL ends with /api
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Make sure API_URL ends with /api
const getApiUrl = () => {
  let url = API_URL;
  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  // Ensure it ends with /api
  if (!url.endsWith('/api')) {
    url = url + '/api';
  }
  return url;
};

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
  const [error, setError] = useState(null);
  
  const API_BASE_URL = getApiUrl();

  // Debug: Log the API configuration
  useEffect(() => {
    console.log('🔧 AuthContext initialized');
    console.log('🔧 API_BASE_URL:', API_BASE_URL);
    console.log('🔧 Environment:', process.env.NODE_ENV);
    console.log('🔧 Full endpoints:');
    console.log(`   Login: ${API_BASE_URL}/auth/login`);
    console.log(`   Register: ${API_BASE_URL}/auth/register`);
    console.log(`   Health: ${API_BASE_URL}/health`);
  }, []);

  // ✅ Health check backend connection
  const checkBackendHealth = async () => {
    try {
      console.log('🔍 Testing backend connection...');
      const healthResponse = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ Backend health check:', healthResponse.status);
      return healthResponse.ok;
    } catch (error) {
      console.error('🔴 Backend health check failed:', error);
      return false;
    }
  };

  // ✅ Register function - FIXED
  const register = async (name, email, password, phone = '') => {
    try {
      setError(null);
      console.log(`📝 Registering → ${API_BASE_URL}/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      console.log('📨 Registration response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed (${response.status})`);
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userEmail', data.user.email);
        
        // Set user state
        setUser(data.user);
        
        // Set default axios header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        console.log('✅ Registration successful, user logged in:', data.user.email);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('🔴 Registration error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Login function - FIXED
  const login = async (email, password) => {
    try {
      setError(null);
      console.log(`🔐 Logging in → ${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📨 Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed (${response.status})`);
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userEmail', data.user.email);
        
        // Set user state
        setUser(data.user);
        
        // Set default axios header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        console.log('✅ Login successful:', data.user.email);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('🔴 Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    console.log('✅ User logged out');
  };

  // ✅ Get current user
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log(`👤 Getting current user → ${API_BASE_URL}/auth/me`);
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      
      if (response.data.success) {
        setUser(response.data.user);
        console.log('✅ Current user loaded:', response.data.user.email);
      } else {
        logout(); // Invalid token, log out
      }
    } catch (error) {
      console.error('🔴 Get current user error:', error);
      if (error.response?.status === 401) {
        logout(); // Token expired or invalid
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update user profile
  const updateProfile = async (userData) => {
    try {
      console.log(`✏️ Updating profile → ${API_BASE_URL}/auth/me`);
      const response = await axios.put(`${API_BASE_URL}/auth/me`, userData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        console.log('✅ Profile updated successfully');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('🔴 Update profile error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  // ✅ Check authentication on app load
  useEffect(() => {
    getCurrentUser();
    
    // Optional: Check backend health on startup
    checkBackendHealth();
  }, []);

  // ✅ Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    clearError,
    checkBackendHealth,
    apiUrl: API_BASE_URL // For debugging
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;