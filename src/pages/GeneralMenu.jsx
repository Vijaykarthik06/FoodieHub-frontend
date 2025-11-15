import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import RestaurantCard from '../components/RestaurantCard';
import './GeneralMenu.css';

// Extract all menu items from your Menu.jsx
const allMenuItems = [
  // Italian Bistro Items
  {
    id: 101,
    restaurantId: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
    price: 160,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'pizza',
    ingredients: ['Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
    isVegetarian: true,
    preparationTime: 15,
    rating: 4.8,
    restaurantName: 'Italian Bistro'
  },
  {
    id: 102,
    restaurantId: 1,
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with pancetta, eggs, and parmesan cheese',
    price: 140,
    image: 'https://plus.unsplash.com/premium_photo-1674511582428-58ce834ce172?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'pasta',
    ingredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Parmesan', 'Black Pepper'],
    preparationTime: 12,
    rating: 4.6,
    restaurantName: 'Italian Bistro'
  },
  {
    id: 105,
    restaurantId: 1,
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers',
    price: 250,
    image: 'https://images.unsplash.com/photo-1631206753348-db44968fd440?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'desserts',
    ingredients: ['Ladyfingers', 'Coffee', 'Mascarpone', 'Cocoa'],
    isVegetarian: true,
    preparationTime: 5,
    rating: 4.9,
    restaurantName: 'Italian Bistro'
  },

  // Burger Heaven Items
  {
    id: 201,
    restaurantId: 2,
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
    price: 200,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'burgers',
    ingredients: ['Beef Patty', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Special Sauce'],
    preparationTime: 10,
    rating: 4.5,
    restaurantName: 'Burger Heaven'
  },
  {
    id: 202,
    restaurantId: 2,
    name: 'Bacon BBQ Burger',
    description: 'Beef patty with crispy bacon, BBQ sauce, and onion rings',
    price: 300,
    image: 'https://images.unsplash.com/photo-1556710807-aa697ab9e415?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'burgers',
    ingredients: ['Beef Patty', 'Bacon', 'BBQ Sauce', 'Onion Rings', 'Cheddar'],
    preparationTime: 12,
    rating: 4.7,
    restaurantName: 'Burger Heaven'
  },
  {
    id: 205,
    restaurantId: 2,
    name: 'Chocolate Milkshake',
    description: 'Creamy chocolate milkshake with whipped cream',
    price: 180,
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'beverages',
    ingredients: ['Vanilla Ice Cream', 'Chocolate Syrup', 'Milk', 'Whipped Cream'],
    isVegetarian: true,
    preparationTime: 5,
    rating: 4.8,
    restaurantName: 'Burger Heaven'
  },

  // Sushi Palace Items
  {
    id: 301,
    restaurantId: 3,
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber wrapped in rice and seaweed',
    price: 200,
    image: 'https://plus.unsplash.com/premium_photo-1712949140561-3d0ddacc4e0e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'sushi',
    ingredients: ['Crab', 'Avocado', 'Cucumber', 'Rice', 'Seaweed'],
    preparationTime: 10,
    rating: 4.6,
    restaurantName: 'Sushi Palace'
  },
  {
    id: 302,
    restaurantId: 3,
    name: 'Salmon Nigiri',
    description: 'Fresh salmon slices over pressed rice',
    price: 300,
    image: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'nigiri',
    ingredients: ['Salmon', 'Sushi Rice', 'Wasabi'],
    preparationTime: 8,
    rating: 4.9,
    restaurantName: 'Sushi Palace'
  },

  // Taco Fiesta Items
  {
    id: 401,
    restaurantId: 4,
    name: 'Carne Asada Tacos',
    description: 'Grilled steak tacos with onions, cilantro, and lime',
    price: 230,
    image: 'https://images.unsplash.com/photo-1707603571504-86c1ea50903e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'tacos',
    ingredients: ['Grilled Steak', 'Onions', 'Cilantro', 'Lime', 'Corn Tortillas'],
    preparationTime: 8,
    rating: 4.7,
    restaurantName: 'Taco Fiesta'
  },
  {
    id: 406,
    restaurantId: 4,
    name: 'Churros',
    description: 'Cinnamon sugar coated fried dough with chocolate sauce',
    price: 300,
    image: 'https://images.unsplash.com/photo-1669867405064-f31e8707216e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'desserts',
    ingredients: ['Flour', 'Cinnamon Sugar', 'Chocolate Sauce'],
    isVegetarian: true,
    preparationTime: 6,
    rating: 4.9,
    restaurantName: 'Taco Fiesta'
  },

  // Green Garden Items
  {
    id: 501,
    restaurantId: 5,
    name: 'Quinoa Buddha Bowl',
    description: 'Nutrient-packed bowl with quinoa and fresh vegetables',
    price: 340,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'bowls',
    ingredients: ['Quinoa', 'Avocado', 'Sweet Potato', 'Kale', 'Tahini Dressing'],
    isVegetarian: true,
    isVegan: true,
    preparationTime: 10,
    rating: 4.6,
    restaurantName: 'Green Garden'
  },
  {
    id: 507,
    restaurantId: 5,
    name: 'Vegan Chocolate Cake',
    description: 'Rich chocolate cake without dairy or eggs',
    price: 410,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'desserts',
    ingredients: ['Flour', 'Cocoa', 'Plant-based Milk', 'Sugar', 'Oil'],
    isVegetarian: true,
    isVegan: true,
    preparationTime: 3,
    rating: 4.9,
    restaurantName: 'Green Garden'
  },

  // Sweet Treats Items
  {
    id: 601,
    restaurantId: 6,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center and vanilla ice cream',
    price: 320,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'cakes',
    ingredients: ['Chocolate', 'Flour', 'Eggs', 'Butter', 'Vanilla Ice Cream'],
    isVegetarian: true,
    preparationTime: 12,
    rating: 4.9,
    restaurantName: 'Sweet Treats'
  },
  {
    id: 602,
    restaurantId: 6,
    name: 'Artisanal Ice Cream',
    description: 'Handcrafted ice cream in various flavors',
    price: 140,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'ice cream',
    ingredients: ['Cream', 'Sugar', 'Flavorings'],
    isVegetarian: true,
    preparationTime: 2,
    rating: 4.8,
    restaurantName: 'Sweet Treats'
  }
];

// Restaurant data for linking
const allRestaurants = [
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
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
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

const GeneralMenu = () => {
  const { addToCart, setCartRestaurant } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [cartNotification, setCartNotification] = useState(null);

  // Get unique categories
  const categories = ['all', ...new Set(allMenuItems.map(item => item.category))];
  
  // Filter items based on selections
  const filteredItems = allMenuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const restaurantMatch = selectedRestaurant === 'all' || item.restaurantId === selectedRestaurant.id;
    return categoryMatch && restaurantMatch;
  });

  const handleAddToCart = (product) => {
    const restaurant = allRestaurants.find(r => r.id === product.restaurantId);
    if (restaurant) {
      setCartRestaurant(restaurant);
    }
    addToCart(product, 1, restaurant);
    
    setCartNotification(product.name);
    setTimeout(() => setCartNotification(null), 3000);
  };

  return (
    <div className="general-menu-page">
      <div className="container">
        <div className="page-header">
          <h1>Our Full Menu</h1>
          <p>Discover all our delicious dishes from various restaurants</p>
        </div>

        {/* Filters */}
        <div className="menu-filters">
          <div className="filter-group">
            <label>Filter by Restaurant:</label>
            <select 
              value={selectedRestaurant === 'all' ? 'all' : selectedRestaurant.id}
              onChange={(e) => setSelectedRestaurant(
                e.target.value === 'all' ? 'all' : 
                allRestaurants.find(r => r.id === parseInt(e.target.value))
              )}
            >
              <option value="all">All Restaurants</option>
              {allRestaurants.map(restaurant => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Category:</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-items-section">
          <h2>
            {selectedRestaurant === 'all' ? 'All Menu Items' : `₹{selectedRestaurant.name} Menu`}
            <span className="item-count"> ({filteredItems.length} items)</span>
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="no-items">
              <p>No items found matching your filters.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedRestaurant('all');
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="menu-grid">
              {filteredItems.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onAddToCart={() => handleAddToCart(item)}
                  showRestaurant={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Notification */}
        {cartNotification && (
          <div className="cart-notification">
            <span>✓ Added {cartNotification} to cart</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralMenu;