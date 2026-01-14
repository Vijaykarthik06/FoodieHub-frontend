import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import RestaurantCard from '../components/RestaurantCard';
import './Home.css';

const featuredProducts = [
  {
    id: 101,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 160,
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
    preparationTime: 15,
    spicyLevel: 'Mild',
    tags: ['Vegetarian', 'Popular', 'Chef Special'],
    isVegetarian: true
  },
  {
    id: 206,
    name: 'Burger Deluxe',
    description: 'Juicy beef patty with premium cheddar cheese, fresh lettuce, ripe tomatoes, and our special signature sauce served on a toasted brioche bun.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'burgers',
    images: [
      'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    ingredients: ['Beef patty', 'Cheddar cheese', 'Lettuce', 'Tomato', 'Special sauce'],
    nutrition: { calories: 450, protein: '25g', carbs: '35g', fat: '22g' },
    rating: 4.5,
    reviews: 89,
    preparationTime: 15,
    spicyLevel: 'Medium',
    tags: ['Meat', 'Popular', 'Best Seller']
  },
  {
    id: 308,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and classic Caesar dressing',
    price: 180,
    image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'salads',
    images: [
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing'],
    nutrition: { calories: 180, protein: '8g', carbs: '12g', fat: '12g' },
    rating: 4.3,
    reviews: 64,
    preparationTime: 10,
    spicyLevel: 'Mild',
    tags: ['Healthy', 'Vegetarian', 'Fresh'],
    isVegetarian: true
  }
];

const popularRestaurants = [
  {
    id: 1,
    name: 'Italian Bistro',
    cuisine: 'Italian, Pizza, Pasta',
    rating: 4.7,
    deliveryTime: 25,
    deliveryFee: 20,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['italian', 'pizza', 'pasta']
  },
  {
    id: 2,
    name: 'Burger Heaven',
    cuisine: 'American, Burgers, Fast Food',
    rating: 4.5,
    deliveryTime: 20,
    deliveryFee: 40,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['american', 'burgers', 'fast food']
  },
  {
    id: 3,
    name: 'Sushi Palace',
    cuisine: 'Japanese, Sushi, Asian',
    rating: 4.8,
    deliveryTime: 30,
    deliveryFee: 30,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    tags: ['japanese', 'sushi', 'asian']
  }
];

const Home = () => {
  const { addToCart, setCartRestaurant } = useCart();
  const [cartNotification, setCartNotification] = useState(null);

  // Mock restaurant data for featured products
  const featuredRestaurant = {
    id: 0,
    name: 'Featured Items',
    cuisine: 'Various Cuisines',
    rating: 4.6,
    deliveryTime: 25,
    deliveryFee: 2.99,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  };

  const handleAddToCart = (product, quantity = 1) => {
    // Set the featured restaurant as the cart restaurant
    setCartRestaurant(featuredRestaurant);
    
    // Add product to cart
    addToCart(product, quantity, featuredRestaurant);
    
    // Show success notification
    setCartNotification({
      productName: product.name,
      quantity: quantity
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setCartNotification(null);
    }, 3000);
  };

  return (
    <div className="home">
      {/* Cart Notification */}
      {cartNotification && (
        <div className="cart-notification-home">
          <div className="notification-content">
            <span className="notification-icon">✓</span>
            <div className="notification-text">
              <strong>Added to cart!</strong>
              <span>{cartNotification.quantity}x {cartNotification.productName}</span>
            </div>
            <Link to="/cart" className="notification-action">
              View Cart
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
          <h1 className="hero-title">Delicious food <br /> delivered to <br /> your door</h1> 
          <p className="hero-subtitle">Order from your favorite local restaurants with just a few clicks</p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary hero-cta">
              View Menu
            </Link>
             <Link to="/restaurants" className="btn btn-primary hero-cta">
              View Restaurants
            </Link> 
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* Featured Products */}
{/* Featured Products */}
<section className="section">
  <div className="container" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
    <div className="section-header">
      <h2 className="section-title">Featured Items</h2>
      <p className="section-subtitle">Most popular dishes this week</p>
    </div>
    <div className="products-grid">
      {featuredProducts.map(item => (
        <ProductCard 
          key={item.id} 
          product={item} 
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
    <div className="text-center mt-4">
      <Link to="/menu" className="btn btn-outline">
        View All Menu
      </Link>
    </div>
  </div>
</section>

      {/* Popular Restaurants */}
      <section className="section section-light">
        <div className="container" data-aos="fade-right" data-aos-delay="200" data-aos-duration="1000">
          <div className="section-header">
            <h2 className="section-title">Popular Restaurants</h2>
            <p className="section-subtitle">Order from our top-rated partners</p>
          </div>
          <div className="restaurants-grid">
            {popularRestaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant}
              />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/restaurants" className="btn btn-outline">
              View All Restaurants & Menu
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container" data-aos="fade-down" data-aos-delay="200" data-aos-duration="1000">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get your favorite food in 3 simple steps</p>
          </div>
          <div className="how-it-works">
            <div className="step" data-aos="fade-up" data-aos-delay="200">
              <div className="step-icon">🍕</div>
              <h3>Choose Your Food</h3>
              <p>Browse through our menu and select your favorite dishes from top restaurants</p>
            </div>
            <div className="step" data-aos="fade-up" data-aos-delay="400">
              <div className="step-icon">🛒</div>
              <h3>Place Your Order</h3>
              <p>Add items to your cart, customize your order, and complete the checkout process</p>
            </div>
            <div className="step" data-aos="fade-up" data-aos-delay="600">
              <div className="step-icon">🚚</div>
              <h3>Enjoy Your Meal</h3>
              <p>Track your order in real-time and enjoy delicious food delivered to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Features */}
      <section className="section section-dark">
        <div className="container" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
          <div className="features-grid">
            <div className="feature" data-aos="fade-right" data-aos-delay="200">
              <div className="feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Get your food delivered in under 30 minutes on average</p>
            </div>
            <div className="feature" data-aos="fade-right" data-aos-delay="400">
              <div className="feature-icon">🌟</div>
              <h3>Top Quality</h3>
              <p>All our restaurant partners are carefully selected for quality</p>
            </div>
            <div className="feature" data-aos="fade-right" data-aos-delay="600">
              <div className="feature-icon">💳</div>
              <h3>Easy Payment</h3>
              <p>Multiple secure payment options available</p>
            </div>
            <div className="feature" data-aos="fade-right" data-aos-delay="800">
              <div className="feature-icon">📱</div>
              <h3>Live Tracking</h3>
              <p>Track your order from kitchen to your doorstep</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;