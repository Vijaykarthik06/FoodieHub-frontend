import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  const {
    id,
    name,
    cuisine,
    rating,
    deliveryTime,
    deliveryFee,
    image,
    tags
  } = restaurant;

  // Function to handle image error
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    e.target.alt = 'Restaurant Image';
  };

  // Function to format delivery fee
  const formatDeliveryFee = (fee) => {
    return fee === 0 ? 'Free delivery' : `₹${fee.toFixed(2)} delivery`;
  };

  // Function to format rating to 1 decimal place
  const formatRating = (rating) => {
    return rating.toFixed(1);
  };

  // Function to format tags (capitalize properly)
  const formatTag = (tag) => {
    return tag.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="restaurant-card" data-aos="fade-up">
      <div className="restaurant-image">
        <img 
          src={image} 
          alt={name}
          loading="lazy"
          onError={handleImageError}
        />
        <div className="restaurant-overlay">
          <Link 
            to={`/menu/${id}`} 
            className="btn btn-primary view-menu-btn"   
          >
            View Menu
          </Link>
        </div>
        <div className="restaurant-rating-badge">
          <span className="rating-star">⭐</span>
          <span className="rating-value">{formatRating(rating)}</span>
        </div>
      </div>
      
      <div className="restaurant-info">
        <h3 className="restaurant-name">{name}</h3>
        <p className="restaurant-cuisine">{cuisine}</p>
        
        <div className="restaurant-details">
          <div className="delivery-info">
            <span className="delivery-time">{deliveryTime} min</span>
            <span className="delivery-separator">•</span>
            <span className="delivery-fee">
              {formatDeliveryFee(deliveryFee)}
            </span>
          </div>
        </div>
        
        <div className="restaurant-tags">
          {tags?.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              {formatTag(tag)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;