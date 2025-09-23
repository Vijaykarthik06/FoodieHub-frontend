import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import './Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call to fetch restaurants
    const fetchRestaurants = () => {
      // Mock data
      const mockRestaurants = [
        {
          id: 1,
          name: 'Italian Bistro',
          cuisine: 'Italian, Pizza, Pasta',
          rating: 4.7,
          deliveryTime: 25,
          deliveryFee: 2.99,
          image: 'https://images.unsplash.com/photo-1622140739492-f82f386260b5?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          tags: ['italian', 'pizza', 'pasta']
        },
        {
          id: 2,
          name: 'Burger Heaven',
          cuisine: 'American, Burgers, Fast Food',
          rating: 4.5,
          deliveryTime: 20,
          deliveryFee: 1.99,
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          tags: ['american', 'burgers', 'fast food']
        },
        {
          id: 3,
          name: 'Sushi Palace',
          cuisine: 'Japanese, Sushi, Asian',
          rating: 4.8,
          deliveryTime: 30,
          deliveryFee: 3.99,
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          tags: ['japanese', 'sushi', 'asian']
        },
        {
          id: 4,
          name: 'Taco Fiesta',
          cuisine: 'Mexican, Tacos, Burritos',
          rating: 4.3,
          deliveryTime: 22,
          deliveryFee: 2.49,
          image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          tags: ['mexican', 'tacos', 'burritos']
        },
        {
          id: 5,
          name: 'Green Garden',
          cuisine: 'Vegetarian, Vegan, Healthy',
          rating: 4.6,
          deliveryTime: 28,
          deliveryFee: 3.49,
          image: 'https://plus.unsplash.com/premium_photo-1663100289422-99a5e0f8f7a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          tags: ['vegetarian', 'vegan', 'healthy']
        },
        {
          id: 6,
          name: 'Sweet Treats',
          cuisine: 'Desserts, Bakery, Ice Cream',
          rating: 4.9,
          deliveryTime: 18,
          deliveryFee: 2.99,
          image: 'https://plus.unsplash.com/premium_photo-1661953124283-76d0a8436b87?q=80&w=1188&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          tags: ['desserts', 'bakery', 'ice cream']
        }
      ];

      setRestaurants(mockRestaurants);
      setFilteredRestaurants(mockRestaurants);
      
      // Extract unique cuisines from tags
      const allCuisines = mockRestaurants.flatMap(restaurant => restaurant.tags);
      const uniqueCuisines = [...new Set(allCuisines)];
      setCuisines(['all', ...uniqueCuisines]);
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = [...restaurants];

    // Filter by cuisine
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(restaurant => 
        restaurant.tags.includes(selectedCuisine)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort restaurants
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'delivery-time') {
        return a.deliveryTime - b.deliveryTime;
      } else if (sortBy === 'delivery-fee') {
        return a.deliveryFee - b.deliveryFee;
      }
      return 0;
    });

    setFilteredRestaurants(filtered);
  }, [restaurants, selectedCuisine, sortBy, searchTerm]);

  return (
    <div className="restaurants-page">
      <div className="container">
        <h1 className="page-title">Our Restaurants</h1>
        
        <div className="restaurants-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="cuisine">Cuisine:</label>
              <select
                id="cuisine"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="filter-select"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="delivery-time">Delivery Time</option>
                <option value="delivery-fee">Delivery Fee</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="restaurants-grid">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <div className="no-results">
              <p>No restaurants found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;