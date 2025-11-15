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

  // Restaurant images data
  const restaurantImages = {
    italian: 'https://images.unsplash.com/photo-1622140739492-f82f386260b5?q=80&w=1172&auto=format&fit=crop',
    american: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop',
    japanese: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    mexican: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop',
    vegetarian: 'https://plus.unsplash.com/premium_photo-1663100289422-99a5e0f8f7a6?q=80&w=1170&auto=format&fit=crop',
    desserts: 'https://plus.unsplash.com/premium_photo-1661953124283-76d0a8436b87?q=80&w=1188&auto=format&fit=crop'
  };

  // Menu items data
  const menuItems = {
    1: [
      {
        id: 101,
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1074&auto=format&fit=crop',
        category: 'pizza',
        ingredients: ['Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
        isVegetarian: true,
        preparationTime: 15,
        rating: 4.8
      },
      {
        id: 102,
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with pancetta, eggs, and parmesan cheese',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1719250726371-b4076d48ce6c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169',
        category: 'pasta',
        ingredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Parmesan', 'Black Pepper'],
        preparationTime: 12,
        rating: 4.6
      }
    ],
    2: [
      {
        id: 201,
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop',
        category: 'burgers',
        ingredients: ['Beef Patty', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Special Sauce'],
        preparationTime: 10,
        rating: 4.5
      },
      {
        id: 202,
        name: 'Bacon BBQ Burger',
        description: 'Beef patty with crispy bacon, BBQ sauce, and onion rings',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433f?q=80&w=1068&auto=format&fit=crop',
        category: 'burgers',
        ingredients: ['Beef Patty', 'Bacon', 'BBQ Sauce', 'Onion Rings', 'Cheddar'],
        preparationTime: 12,
        rating: 4.7
      }
    ],
    3: [
      {
        id: 301,
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber wrapped in rice and seaweed',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1127&auto=format&fit=crop',
        category: 'sushi rolls',
        ingredients: ['Crab', 'Avocado', 'Cucumber', 'Rice', 'Seaweed'],
        preparationTime: 10,
        rating: 4.6
      },
      {
        id: 302,
        name: 'Salmon Nigiri',
        description: 'Fresh salmon slices over pressed rice',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=1160&auto=format&fit=crop',
        category: 'nigiri',
        ingredients: ['Salmon', 'Sushi Rice', 'Wasabi'],
        preparationTime: 8,
        rating: 4.9
      }
    ],
    4: [
      {
        id: 401,
        name: 'Carne Asada Tacos',
        description: 'Grilled steak tacos with onions, cilantro, and lime',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1170&auto=format&fit=crop',
        category: 'tacos',
        ingredients: ['Grilled Steak', 'Onions', 'Cilantro', 'Lime', 'Corn Tortillas'],
        preparationTime: 8,
        rating: 4.7
      }
    ],
    5: [
      {
        id: 501,
        name: 'Quinoa Buddha Bowl',
        description: 'Nutrient-packed bowl with quinoa and fresh vegetables',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop',
        category: 'bowls',
        ingredients: ['Quinoa', 'Avocado', 'Sweet Potato', 'Kale', 'Tahini Dressing'],
        isVegetarian: true,
        isVegan: true,
        preparationTime: 10,
        rating: 4.6
      }
    ],
    6: [
      {
        id: 601,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center and vanilla ice cream',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1170&auto=format&fit=crop',
        category: 'cakes',
        ingredients: ['Chocolate', 'Flour', 'Eggs', 'Butter', 'Vanilla Ice Cream'],
        isVegetarian: true,
        preparationTime: 12,
        rating: 4.9
      }
    ]
  };

  // Function to initialize restaurants data
  const initializeRestaurants = () => {
    const mockRestaurants = [
      {
        id: 1,
        name: 'Italian Bistro',
        cuisine: 'Italian, Pizza, Pasta',
        rating: 4.7,
        deliveryTime: 25,
        deliveryFee: 20,
        image: restaurantImages.italian,
        tags: ['italian', 'pizza', 'pasta'],
        menuItems: menuItems[1]
      },
      {
        id: 2,
        name: 'Burger Heaven',
        cuisine: 'American, Burgers, Fast Food',
        rating: 4.5,
        deliveryTime: 20,
        deliveryFee: 40,
        image: restaurantImages.american,
        tags: ['american', 'burgers', 'fast food'],
        menuItems: menuItems[2]
      },
      {
        id: 3,
        name: 'Sushi Palace',
        cuisine: 'Japanese, Sushi, Asian',
        rating: 4.8,
        deliveryTime: 30,
        deliveryFee: 30,
        image: restaurantImages.japanese,
        tags: ['japanese', 'sushi', 'asian'],
        menuItems: menuItems[3]
      },
      {
        id: 4,
        name: 'Taco Fiesta',
        cuisine: 'Mexican, Tacos, Burritos',
        rating: 4.3,
        deliveryTime: 22,
        deliveryFee: 25,
        image: restaurantImages.mexican,
        tags: ['mexican', 'tacos', 'burritos'],
        menuItems: menuItems[4]
      },
      {
        id: 5,
        name: 'Green Garden',
        cuisine: 'Vegetarian, Vegan, Healthy',
        rating: 4.6,
        deliveryTime: 28,
        deliveryFee: 35,
        image: restaurantImages.vegetarian,
        tags: ['vegetarian', 'vegan', 'healthy'],
        menuItems: menuItems[5]
      },
      {
        id: 6,
        name: 'Sweet Treats',
        cuisine: 'Desserts, Bakery, Ice Cream',
        rating: 4.9,
        deliveryTime: 18,
        deliveryFee: 50,
        image: restaurantImages.desserts,
        tags: ['desserts', 'bakery', 'ice cream'],
        menuItems: menuItems[6]
      }
    ];
    return mockRestaurants;
  };

  // Function to extract unique cuisines
  const extractUniqueCuisines = (restaurantsData) => {
    const allCuisines = restaurantsData.flatMap(restaurant => restaurant.tags);
    const uniqueCuisines = [...new Set(allCuisines)];
    return ['all', ...uniqueCuisines];
  };

  // Function to filter and sort restaurants
  const filterAndSortRestaurants = (restaurantsData, cuisine, sort, search) => {
    let filtered = [...restaurantsData];

    // Filter by cuisine
    if (cuisine !== 'all') {
      filtered = filtered.filter(restaurant => 
        restaurant.tags.includes(cuisine)
      );
    }

    // Filter by search term
    if (search) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort restaurants
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'delivery-time':
          return a.deliveryTime - b.deliveryTime;
        case 'delivery-fee':
          return a.deliveryFee - b.deliveryFee;
        default:
          return 0;
      }
    });
  };

  // Initialize restaurants on component mount
  useEffect(() => {
    const restaurantsData = initializeRestaurants();
    setRestaurants(restaurantsData);
    setFilteredRestaurants(restaurantsData);
    setCuisines(extractUniqueCuisines(restaurantsData));
  }, []);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    const filtered = filterAndSortRestaurants(
      restaurants, 
      selectedCuisine, 
      sortBy, 
      searchTerm
    );
    setFilteredRestaurants(filtered);
  }, [restaurants, selectedCuisine, sortBy, searchTerm]);

  // Handler functions
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCuisineChange = (e) => {
    setSelectedCuisine(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

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
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="cuisine">Cuisine:</label>
              <select
                id="cuisine"
                value={selectedCuisine}
                onChange={handleCuisineChange}
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
                onChange={handleSortChange}
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
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
              />
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