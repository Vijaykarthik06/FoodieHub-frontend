import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  
  // Create refs for scrolling
  const topRef = useRef(null);
  const formRef = useRef(null);

  // Generate a unique storage key based on user email
  const getStorageKey = (email) => `userProfile_${email}`;

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll to form function
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    if (user && user.email) {
      // Load user profile data from localStorage based on email
      const storageKey = getStorageKey(user.email);
      const savedProfile = localStorage.getItem(storageKey);
      
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setFormData(profileData);
      } else {
        // Initialize with user data if no saved profile exists
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          address: '',
          city: '',
          zipCode: ''
        });
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save profile data to localStorage using email as key
      if (user && user.email) {
        const storageKey = getStorageKey(user.email);
        localStorage.setItem(storageKey, JSON.stringify(formData));
        
        // Show success notification
        setMessage('Profile updated successfully! 🎉');
        setShowNotification(true);
        
        // Scroll to top to show the notification
        scrollToTop();
        
        // Also update the user context if name changed
        if (formData.name !== user.name) {
          console.log('Name updated:', formData.name);
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Error updating profile. Please try again.');
      setShowNotification(true);
      scrollToTop();
    } finally {
      setLoading(false);
      
      // Clear message and notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
        setTimeout(() => setMessage(''), 300);
      }, 3000);
    }
  };

  // Function to get user stats (you can modify this to fetch real data)
  const getUserStats = (email) => {
    const statsKey = `userStats_${email}`;
    const savedStats = localStorage.getItem(statsKey);
    
    if (savedStats) {
      return JSON.parse(savedStats);
    }
    
    // Default stats for new users
    return {
      orders: 0,
      favorites: 0,
      memberSince: new Date().getFullYear()
    };
  };

  const userStats = user ? getUserStats(user.email) : { orders: 0, favorites: 0, memberSince: new Date().getFullYear() };

  return (
    <div className="profile-page" ref={topRef}>
      {/* Success Notification */}
      {showNotification && (
        <div className={`notification ${message.includes('Error') ? 'notification-error' : 'notification-success'}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {message.includes('Error') ? '❌' : '✅'}
            </span>
            <span className="notification-message">{message}</span>
            <button 
              className="notification-close"
              onClick={() => setShowNotification(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="container">
        <h1 className="page-title">Your Profile</h1>
        
        <div className="profile-content">
          <div className="profile-form" ref={formRef}>
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2 className="section-title">Personal Information</h2>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled // Email shouldn't be editable usually
                  />
                  <small className="form-help">Email cannot be changed</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h2 className="section-title">Delivery Address</h2>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                {user?.name?.charAt(0) || formData.name?.charAt(0) || 'U'}
              </div>
              <h2 className="profile-name">{formData.name || user?.name || 'User'}</h2>
              <p className="profile-email">{user?.email}</p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{userStats.orders}</span>
                  <span className="stat-label">Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{userStats.favorites}</span>
                  <span className="stat-label">Favorites</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{userStats.memberSince}</span>
                  <span className="stat-label">Member Since</span>
                </div>
              </div>
            </div>
            
            <div className="preferences-card">
              <h3>Preferences</h3>
              <div className="preference-item">
                <label className="preference-label">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    onChange={(e) => {
                      const prefsKey = `userPrefs_${user?.email}`;
                      const prefs = JSON.parse(localStorage.getItem(prefsKey) || '{}');
                      prefs.emailNotifications = e.target.checked;
                      localStorage.setItem(prefsKey, JSON.stringify(prefs));
                      
                      // Show notification for preference change
                      setMessage(`Email notifications ${e.target.checked ? 'enabled' : 'disabled'}`);
                      setShowNotification(true);
                      scrollToTop();
                      setTimeout(() => setShowNotification(false), 2000);
                    }}
                  />
                  <span className="checkmark"></span>
                  Email notifications
                </label>
              </div>
              <div className="preference-item">
                <label className="preference-label">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    onChange={(e) => {
                      const prefsKey = `userPrefs_${user?.email}`;
                      const prefs = JSON.parse(localStorage.getItem(prefsKey) || '{}');
                      prefs.specialOffers = e.target.checked;
                      localStorage.setItem(prefsKey, JSON.stringify(prefs));
                      
                      // Show notification for preference change
                      setMessage(`Special offers ${e.target.checked ? 'enabled' : 'disabled'}`);
                      setShowNotification(true);
                      scrollToTop();
                      setTimeout(() => setShowNotification(false), 2000);
                    }}
                  />
                  <span className="checkmark"></span>
                  Special offers
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;