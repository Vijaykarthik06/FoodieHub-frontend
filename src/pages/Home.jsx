import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import RestaurantCard from '../components/RestaurantCard';
import './Home.css';

// Sample data (would normally come from API)
const featuredProducts = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'pizza',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    ingredients: ['Tomato sauce', 'Mozzarella cheese', 'Fresh basil', 'Olive oil'],
    nutrition: { calories: 285, protein: '12g', carbs: '35g', fat: '10g' },
    rating: 4.8,
    reviews: 127,
    preparationTime: '20-25 mins',
    spicyLevel: 'Mild',
    tags: ['Vegetarian', 'Popular', 'Chef Special']
  },
  {
    id: 2,
      name: 'Pepperoni Pizza',
      description: 'A classic favorite with spicy pepperoni, rich tomato sauce, and melted mozzarella cheese. Perfect for meat lovers!',
      price: 14.99,
      image: 'https://plus.unsplash.com/premium_photo-1674147605295-53b30e11d8c0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'burgers',
    images: [
      'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    ingredients: ['Beef patty', 'Cheese', 'Lettuce', 'Tomato', 'Special sauce'],
    nutrition: { calories: 450, protein: '25g', carbs: '35g', fat: '22g' },
    rating: 4.5,
    reviews: 89,
    preparationTime: '15-20 mins',
    spicyLevel: 'Medium',
    tags: ['Meat', 'Popular', 'Best Seller']
  },
  {
    id: 3,
      name: 'Burger Deluxe',
      description: 'Juicy beef patty with premium cheddar cheese, fresh lettuce, ripe tomatoes, and our special signature sauce served on a toasted brioche bun.',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'salads',
    images: [
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing'],
    nutrition: { calories: 180, protein: '8g', carbs: '12g', fat: '12g' },
    rating: 4.3,
    reviews: 64,
    preparationTime: '10-15 mins',
    spicyLevel: 'Mild',
    tags: ['Healthy', 'Vegetarian', 'Fresh']
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
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    name: 'Burger Heaven',
    cuisine: 'American, Burgers, Fast Food',
    rating: 4.5,
    deliveryTime: 20,
    deliveryFee: 1.99,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    name: 'Sushi Palace',
    cuisine: 'Japanese, Sushi, Asian',
    rating: 4.8,
    deliveryTime: 30,
    deliveryFee: 3.99,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Delicious food <br /> delivered to <br /> your door</h1> 
          <p className="hero-subtitle">Order from your favorite local restaurants with just a few clicks</p>
          <Link to="/menu" className="btn btn-primary hero-cta">
            Order Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Items</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
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
    </div>
  );
};

export default Home;