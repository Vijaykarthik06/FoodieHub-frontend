import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      <div className="restaurant-image">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="restaurant-rating">
          ⭐ {restaurant.rating}
        </div>
      </div>
      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        <p className="restaurant-cuisine">{restaurant.cuisine}</p>
        <div className="restaurant-details">
          <span className="delivery-time">🕒 {restaurant.deliveryTime} min</span>
          <span className="delivery-fee">🚴 ${restaurant.deliveryFee} delivery</span>
        </div>
        <div className="restaurant-footer">
          <Link to={`/restaurants/${restaurant.id}`} className="btn btn-outline">
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;