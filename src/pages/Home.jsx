import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import RestaurantCard from '../components/RestaurantCard';
import QuickView from '../components/QuickView';
import './Home.css';

// Sample data (would normally come from API)
const featuredProducts = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'pizza'
  },
  {
    id: 2,
    name: 'Burger Deluxe',
    description: 'Juicy beef patty with cheese, lettuce, and special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'burgers'
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan, croutons, and caesar dressing',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'salads'
  }
];

const popularRestaurants = [
  {
    id: 1,
    name: 'Italian Bistro',
    cuisine: 'Italian, Pizza, Pasta',
    rating: 4.7,
    deliveryTime: 25,
    deliveryFee: 2.99,
    image: 'https://images.unsplash.com/photo-1622140739492-f82f386260b5?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    name: 'Burger Heaven',
    cuisine: 'American, Burgers, Fast Food',
    rating: 4.5,
    deliveryTime: 20,
    deliveryFee: 1.99,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    name: 'Sushi Palace',
    cuisine: 'Japanese, Sushi, Asian',
    rating: 4.8,
    deliveryTime: 30,
    deliveryFee: 3.99,
    image: 'https://plus.unsplash.com/premium_photo-1668146932065-d08643791942?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

const Home = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Delicious food delivered to your door</h1> 
          <p className="hero-subtitle">Order from your favorite local restaurants with just a few clicks</p>
          <Link to="/menu" className="btn btn-primary hero-cta">
            Order Now
          </Link>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1615719413546-198b25453f85?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Food delivery" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Items</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={() => handleQuickView(product)}
              />
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/menu" className="btn btn-outline">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="section section-light">
        <div className="container">
          <h2 className="section-title">Popular Restaurants</h2>
          <div className="restaurants-grid">
            {popularRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/restaurants" className="btn btn-outline">
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="how-it-works">
            <div className="step">
              <div className="step-icon">1</div>
              <h3>Choose Your Food</h3>
              <p>Browse through our menu and select your favorite dishes</p>
            </div>
            <div className="step">
              <div className="step-icon">2</div>
              <h3>Place Your Order</h3>
              <p>Add items to your cart and complete the checkout process</p>
            </div>
            <div className="step">
              <div className="step-icon">3</div>
              <h3>Enjoy Your Meal</h3>
              <p>Track your order and enjoy delicious food delivered to you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <QuickView 
          product={quickViewProduct}
          onClose={handleCloseQuickView}
        />
      )}
    </div>
  );
};

export default Home;