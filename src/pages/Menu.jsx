import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './Menu.css';

const Menu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartRestaurant } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cartNotification, setCartNotification] = useState(null);

  // Default nutrition data
  const defaultNutrition = { calories: 0, protein: '0g', carbs: '0g', fat: '0g' };

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const fetchRestaurantAndMenu = async () => {
    setLoading(true);
    try {
      const restaurantData = getRestaurantById(parseInt(restaurantId));
      let menuData = getMenuItemsByRestaurant(parseInt(restaurantId));
      
      // Ensure all menu items have required properties
      menuData = menuData.map(item => ({
        ...item,
        nutrition: item.nutrition || defaultNutrition,
        reviews: item.reviews || 0,
        spiceLevel: item.spiceLevel || 'Mild',
        tags: item.tags || [],
        images: item.images || [item.image] // Use main image as fallback
      }));
      
      setRestaurant(restaurantData);
      setMenuItems(menuData);
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(menuData.map(item => item.category))];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantById = (id) => {
    const restaurants = [
      {
        id: 1,
        name: 'Italian Bistro',
        cuisine: 'Italian, Pizza, Pasta',
        rating: 4.7,
        deliveryTime: 25,
        deliveryFee: 2.99,
        image: 'https://images.unsplash.com/photo-1622140739492-f82f386260b5?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['italian', 'pizza', 'pasta'],
        description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes.'
      },
      {
        id: 2,
        name: 'Burger Heaven',
        cuisine: 'American, Burgers, Fast Food',
        rating: 4.5,
        deliveryTime: 20,
        deliveryFee: 1.99,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['american', 'burgers', 'fast food'],
        description: 'Gourmet burgers and classic American comfort food.'
      },
      {
        id: 3,
        name: 'Sushi Palace',
        cuisine: 'Japanese, Sushi, Asian',
        rating: 4.8,
        deliveryTime: 30,
        deliveryFee: 3.99,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
        tags: ['japanese', 'sushi', 'asian'],
        description: 'Fresh sushi and authentic Japanese dishes prepared by master chefs.'
      },
      {
        id: 4,
        name: 'Taco Fiesta',
        cuisine: 'Mexican, Tacos, Burritos',
        rating: 4.3,
        deliveryTime: 22,
        deliveryFee: 2.49,
        image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['mexican', 'tacos', 'burritos'],
        description: 'Vibrant Mexican flavors with authentic street-style tacos and more.'
      },
      {
        id: 5,
        name: 'Green Garden',
        cuisine: 'Vegetarian, Vegan, Healthy',
        rating: 4.6,
        deliveryTime: 28,
        deliveryFee: 3.49,
        image: 'https://plus.unsplash.com/premium_photo-1663100289422-99a5e0f8f7a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['vegetarian', 'vegan', 'healthy'],
        description: 'Fresh, organic plant-based dishes for health-conscious food lovers.'
      },
      {
        id: 6,
        name: 'Sweet Treats',
        cuisine: 'Desserts, Bakery, Ice Cream',
        rating: 4.9,
        deliveryTime: 18,
        deliveryFee: 2.99,
        image: 'https://plus.unsplash.com/premium_photo-1661953124283-76d0a8436b87?q=80&w=1188&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tags: ['desserts', 'bakery', 'ice cream'],
        description: 'Decadent desserts, fresh baked goods, and artisanal ice creams.'
      }
    ];
    return restaurants.find(r => r.id === id) || null;
  };

  const getMenuItemsByRestaurant = (restaurantId) => {
    const allMenuItems = [
      // Italian Bistro (ID: 1)
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
        reviews: 127,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Popular', 'Chef Special'],
        nutrition: { calories: 285, protein: '12g', carbs: '35g', fat: '10g' },
        images: [
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
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
        reviews: 89,
        spiceLevel: 'Mild',
        tags: ['Creamy', 'Classic', 'Italian'],
        nutrition: { calories: 420, protein: '18g', carbs: '45g', fat: '16g' },
        images: [
          'https://plus.unsplash.com/premium_photo-1674511582428-58ce834ce172?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 103,
        restaurantId: 1,
        name: 'Chicken Parmesan',
        description: 'Breaded chicken topped with marinara and melted mozzarella',
        price: 250,
        image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'main course',
        ingredients: ['Chicken Breast', 'Marinara Sauce', 'Mozzarella', 'Bread Crumbs'],
        preparationTime: 20,
        rating: 4.7,
        reviews: 156,
        spiceLevel: 'Mild',
        tags: ['Meat', 'Cheesy', 'Comfort Food'],
        nutrition: { calories: 520, protein: '35g', carbs: '28g', fat: '28g' },
        images: [
          'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1671547329181-8b1925cab127?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070'
        ]
      },
      {
        id: 104,
        restaurantId: 1,
        name: 'Garlic Breadsticks',
        description: 'Freshly baked breadsticks brushed with garlic butter and herbs',
        price: 110,
        image: 'https://plus.unsplash.com/premium_photo-1711752902734-a36167479983?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'appetizers',
        ingredients: ['Bread dough', 'Garlic', 'Butter', 'Parsley', 'Parmesan'],
        isVegetarian: true,
        preparationTime: 8,
        rating: 4.5,
        reviews: 203,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Garlic', 'Baked'],
        nutrition: { calories: 180, protein: '6g', carbs: '22g', fat: '8g' },
        images: [
          'https://plus.unsplash.com/premium_photo-1711752902734-a36167479983?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
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
        reviews: 278,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Coffee', 'Classic'],
        nutrition: { calories: 320, protein: '8g', carbs: '35g', fat: '18g' },
        images: [
          'https://images.unsplash.com/photo-1631206753348-db44968fd440?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },

      // Burger Heaven (ID: 2)
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
        reviews: 312,
        spiceLevel: 'Mild',
        tags: ['Meat', 'Classic', 'Popular'],
        nutrition: { calories: 560, protein: '28g', carbs: '35g', fat: '32g' },
        images: [
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
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
        reviews: 189,
        spiceLevel: 'Mild',
        tags: ['Meat', 'BBQ', 'Bacon'],
        nutrition: { calories: 680, protein: '35g', carbs: '42g', fat: '38g' },
        images: [
          'https://images.unsplash.com/photo-1556710807-aa697ab9e415?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 203,
        restaurantId: 2,
        name: 'Crispy Chicken Burger',
        description: 'Crispy fried chicken breast with mayo and pickles',
        price: 420,
        image: 'https://images.unsplash.com/photo-1690749127581-c9351d7d0abc?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'burgers',
        ingredients: ['Chicken Breast', 'Mayo', 'Pickles', 'Lettuce', 'Brioche Bun'],
        preparationTime: 11,
        rating: 4.4,
        reviews: 167,
        spiceLevel: 'Mild',
        tags: ['Chicken', 'Crispy', 'Popular'],
        nutrition: { calories: 520, protein: '32g', carbs: '38g', fat: '25g' },
        images: [
          'https://images.unsplash.com/photo-1690749127581-c9351d7d0abc?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 204,
        restaurantId: 2,
        name: 'French Fries',
        description: 'Golden crispy fries with sea salt',
        price: 130,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'sides',
        ingredients: ['Potatoes', 'Vegetable Oil', 'Sea Salt'],
        isVegetarian: true,
        isVegan: true,
        preparationTime: 8,
        rating: 4.3,
        reviews: 445,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Crispy'],
        nutrition: { calories: 320, protein: '4g', carbs: '42g', fat: '15g' },
        images: [
          'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
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
        reviews: 278,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Sweet', 'Creamy'],
        nutrition: { calories: 380, protein: '8g', carbs: '45g', fat: '18g' },
        images: [
          'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },

      // Sushi Palace (ID: 3)
      {
        id: 301,
        restaurantId: 3,
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber wrapped in rice and seaweed',
        price: 200,
        image: 'https://plus.unsplash.com/premium_photo-1712949140561-3d0ddacc4e0e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'sushi rolls',
        ingredients: ['Crab', 'Avocado', 'Cucumber', 'Rice', 'Seaweed'],
        preparationTime: 10,
        rating: 4.6,
        reviews: 234,
        spiceLevel: 'Mild',
        tags: ['Seafood', 'Fresh', 'Popular'],
        nutrition: { calories: 290, protein: '9g', carbs: '42g', fat: '8g' },
        images: [
          'https://plus.unsplash.com/premium_photo-1712949140561-3d0ddacc4e0e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
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
        reviews: 189,
        spiceLevel: 'Mild',
        tags: ['Seafood', 'Premium', 'Fresh'],
        nutrition: { calories: 180, protein: '12g', carbs: '28g', fat: '4g' },
        images: [
          'https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 303,
        restaurantId: 3,
        name: 'Spicy Tuna Roll',
        description: 'Spicy tuna with cucumber and spicy mayo',
        price: 320,
        image: 'https://plus.unsplash.com/premium_photo-1712949157780-c308bde2f526?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'sushi rolls',
        ingredients: ['Tuna', 'Cucumber', 'Spicy Mayo', 'Rice', 'Seaweed'],
        spiceLevel: 2,
        preparationTime: 12,
        rating: 4.7,
        reviews: 156,
        spiceLevel: 'Medium',
        tags: ['Seafood', 'Spicy', 'Popular'],
        nutrition: { calories: 320, protein: '15g', carbs: '38g', fat: '12g' },
        images: [
          'https://plus.unsplash.com/premium_photo-1712949157780-c308bde2f526?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 304,
        restaurantId: 3,
        name: 'Miso Soup',
        description: 'Traditional Japanese soup with tofu and seaweed',
        price: 180,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'soups',
        ingredients: ['Miso Paste', 'Tofu', 'Seaweed', 'Green Onions'],
        isVegetarian: true,
        preparationTime: 6,
        rating: 4.4,
        reviews: 278,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Healthy', 'Traditional'],
        nutrition: { calories: 80, protein: '6g', carbs: '8g', fat: '3g' },
        images: [
          'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 305,
        restaurantId: 3,
        name: 'Edamame',
        description: 'Steamed young soybeans with sea salt',
        price: 260,
        image: 'https://plus.unsplash.com/premium_photo-1666318300285-d97528868ff4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'appetizers',
        ingredients: ['Edamame', 'Sea Salt'],
        isVegetarian: true,
        isVegan: true,
        preparationTime: 5,
        rating: 4.5,
        reviews: 189,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Healthy'],
        nutrition: { calories: 120, protein: '11g', carbs: '10g', fat: '5g' },
        images: [
          'https://plus.unsplash.com/premium_photo-1666318300285-d97528868ff4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },

      // Taco Fiesta (ID: 4)
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
        reviews: 234,
        spiceLevel: 'Medium',
        tags: ['Meat', 'Spicy', 'Traditional'],
        nutrition: { calories: 320, protein: '22g', carbs: '25g', fat: '15g' },
        images: [
          'https://images.unsplash.com/photo-1707603571504-86c1ea50903e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 402,
        restaurantId: 4,
        name: 'Chicken Quesadilla',
        description: 'Flour tortilla filled with chicken and melted cheese',
        price: 280,
        image: 'https://images.unsplash.com/photo-1628430044262-fb84cffbb744?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'quesadillas',
        ingredients: ['Chicken', 'Cheese', 'Flour Tortilla', 'Sour Cream'],
        preparationTime: 7,
        rating: 4.5,
        reviews: 167,
        spiceLevel: 'Mild',
        tags: ['Chicken', 'Cheesy', 'Popular'],
        nutrition: { calories: 420, protein: '25g', carbs: '32g', fat: '22g' },
        images: [
          'https://images.unsplash.com/photo-1628430044262-fb84cffbb744?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 403,
        restaurantId: 4,
        name: 'Vegetarian Burrito',
        description: 'Large burrito with rice, beans, and fresh vegetables',
        price: 220,
        image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'burritos',
        ingredients: ['Rice', 'Black Beans', 'Vegetables', 'Cheese', 'Flour Tortilla'],
        isVegetarian: true,
        preparationTime: 9,
        rating: 4.4,
        reviews: 145,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Healthy', 'Filling'],
        nutrition: { calories: 480, protein: '18g', carbs: '65g', fat: '16g' },
        images: [
          'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 404,
        restaurantId: 4,
        name: 'Guacamole & Chips',
        description: 'Fresh avocado dip with crispy tortilla chips',
        price: 170,
        image: 'https://images.unsplash.com/photo-1648437595584-62d15da353b7?q=80&w=1134&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'appetizers',
        ingredients: ['Avocado', 'Tomato', 'Onion', 'Lime', 'Tortilla Chips'],
        isVegetarian: true,
        isVegan: true,
        preparationTime: 5,
        rating: 4.6,
        reviews: 278,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Fresh'],
        nutrition: { calories: 280, protein: '4g', carbs: '22g', fat: '20g' },
        images: [
          'https://images.unsplash.com/photo-1648437595584-62d15da353b7?q=80&w=1134&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 405,
        restaurantId: 4,
        name: 'Fish Tacos',
        description: 'Beer-battered fish tacos with cabbage slaw',
        price: 320,
        image: 'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'tacos',
        ingredients: ['Fish', 'Cabbage', 'Lime Crema', 'Corn Tortillas'],
        preparationTime: 10,
        rating: 4.8,
        reviews: 189,
        spiceLevel: 'Mild',
        tags: ['Seafood', 'Fresh', 'Popular'],
        nutrition: { calories: 340, protein: '20g', carbs: '28g', fat: '16g' },
        images: [
          'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
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
        reviews: 312,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Sweet', 'Traditional'],
        nutrition: { calories: 280, protein: '3g', carbs: '45g', fat: '10g' },
        images: [
          'https://images.unsplash.com/photo-1669867405064-f31e8707216e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 407,
        restaurantId: 4,
        name: 'Horchata',
        description: 'Traditional Mexican rice drink with cinnamon',
        price: 240,
        image: 'https://growingupbilingual.com/wp-content/uploads/2023/01/Depositphotos_488216354_XL-e1675165547582.jpg',
        category: 'beverages',
        ingredients: ['Rice', 'Cinnamon', 'Vanilla', 'Milk'],
        isVegetarian: true,
        preparationTime: 3,
        rating: 4.7,
        reviews: 189,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Refreshing', 'Traditional'],
        nutrition: { calories: 180, protein: '4g', carbs: '32g', fat: '3g' },
        images: [
          'https://growingupbilingual.com/wp-content/uploads/2023/01/Depositphotos_488216354_XL-e1675165547582.jpg',
          'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },

      // Green Garden (ID: 5)
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
        reviews: 167,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Healthy'],
        nutrition: { calories: 380, protein: '15g', carbs: '45g', fat: '18g' },
        images: [
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 502,
        restaurantId: 5,
        name: 'Vegan Lasagna',
        description: 'Layered pasta with plant-based cheese and vegetables',
        price: 270,
        image: 'https://plus.unsplash.com/premium_photo-1723770033472-0b0452d98225?q=80&w=1097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'main course',
        ingredients: ['Lasagna Noodles', 'Plant-based Cheese', 'Vegetables', 'Tomato Sauce'],
        isVegetarian: true,
        isVegan: true,
        preparationTime: 15,
        rating: 4.5,
        reviews: 134,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Comfort Food'],
        nutrition: { calories: 420, protein: '18g', carbs: '52g', fat: '16g' },
        images: [
          'https://plus.unsplash.com/premium_photo-1723770033472-0b0452d98225?q=80&w=1097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 503,
        restaurantId: 5,
        name: 'Superfood Salad',
        description: 'Mixed greens with berries, nuts, and goat cheese',
        price: 220,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'salads',
        ingredients: ['Mixed Greens', 'Berries', 'Walnuts', 'Goat Cheese', 'Balsamic'],
        isVegetarian: true,
        preparationTime: 8,
        rating: 4.7,
        reviews: 189,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Healthy', 'Fresh'],
        nutrition: { calories: 280, protein: '12g', carbs: '22g', fat: '18g' },
        images: [
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 504,
        restaurantId: 5,
        name: 'Avocado Toast',
        description: 'Sourdough toast with smashed avocado and microgreens',
        price: 340,
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'breakfast',
        ingredients: ['Sourdough Bread', 'Avocado', 'Microgreens', 'Lemon', 'Chili Flakes'],
        isVegetarian: true,
        isVegan: true,
        preparationTime: 5,
        rating: 4.8,
        reviews: 234,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Healthy'],
        nutrition: { calories: 320, protein: '8g', carbs: '35g', fat: '18g' },
        images: [
          'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 505,
        restaurantId: 5,
        name: 'Vegetable Stir Fry',
        description: 'Wok-tossed vegetables with tofu and brown rice',
        price: 275,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'main course',
        ingredients: ['Mixed Vegetables', 'Tofu', 'Brown Rice', 'Soy Sauce'],
        isVegetarian: true,
        isVegan: true,
        preparationTime: 12,
        rating: 4.4,
        reviews: 156,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Healthy'],
        nutrition: { calories: 350, protein: '16g', carbs: '48g', fat: '12g' },
        images: [
          'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 506,
        restaurantId: 5,
        name: 'Green Smoothie',
        description: 'Blended kale, spinach, banana, and almond milk',
        price: 200,
        image: 'https://plus.unsplash.com/premium_photo-1700084621249-b22c621ac4e9?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'beverages',
        ingredients: ['Kale', 'Spinach', 'Banana', 'Almond Milk', 'Chia Seeds'],
        isVegetarian: true,
        isVegan: true,
        preparationTime: 4,
        rating: 4.6,
        reviews: 189,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Healthy'],
        nutrition: { calories: 180, protein: '6g', carbs: '32g', fat: '5g' },
        images: [
          'https://plus.unsplash.com/premium_photo-1700084621249-b22c621ac4e9?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
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
        reviews: 278,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Vegan', 'Sweet'],
        nutrition: { calories: 320, protein: '4g', carbs: '45g', fat: '14g' },
        images: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },

      // Sweet Treats (ID: 6)
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
        reviews: 445,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Sweet', 'Popular'],
        nutrition: { calories: 420, protein: '6g', carbs: '52g', fat: '22g' },
        images: [
          'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
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
        reviews: 312,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Cold', 'Sweet'],
        nutrition: { calories: 280, protein: '4g', carbs: '32g', fat: '15g' },
        images: [
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 603,
        restaurantId: 6,
        name: 'Fresh Croissants',
        description: 'Buttery, flaky French croissants',
        price: 180,
        image: 'https://images.unsplash.com/photo-1747459707225-65744d0ae6be?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'pastries',
        ingredients: ['Flour', 'Butter', 'Yeast', 'Milk'],
        isVegetarian: true,
        preparationTime: 3,
        rating: 4.7,
        reviews: 278,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Buttery', 'Flaky'],
        nutrition: { calories: 320, protein: '6g', carbs: '35g', fat: '18g' },
        images: [
          'https://images.unsplash.com/photo-1747459707225-65744d0ae6be?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 604,
        restaurantId: 6,
        name: 'Fruit Tart',
        description: 'Shortcrust pastry with custard and fresh fruits',
        price: 220,
        image: 'https://plus.unsplash.com/premium_photo-1664472613567-2176b50ddb28?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'tarts',
        ingredients: ['Shortcrust Pastry', 'Custard', 'Fresh Fruits', 'Glaze'],
        isVegetarian: true,
        preparationTime: 4,
        rating: 4.6,
        reviews: 189,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Fruity', 'Fresh'],
        nutrition: { calories: 280, protein: '4g', carbs: '38g', fat: '12g' },
        images: [
          'https://plus.unsplash.com/premium_photo-1664472613567-2176b50ddb28?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 605,
        restaurantId: 6,
        name: 'Cheesecake',
        description: 'Creamy New York style cheesecake with berry compote',
        price: 280,
        image: 'https://images.unsplash.com/photo-1702925614886-50ad13c88d3f?q=80&w=789&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'cakes',
        ingredients: ['Cream Cheese', 'Graham Cracker Crust', 'Eggs', 'Sugar', 'Berries'],
        isVegetarian: true,
        preparationTime: 5,
        rating: 4.9,
        reviews: 334,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Creamy', 'Popular'],
        nutrition: { calories: 380, protein: '8g', carbs: '42g', fat: '20g' },
        images: [
          'https://images.unsplash.com/photo-1702925614886-50ad13c88d3f?q=80&w=789&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 606,
        restaurantId: 6,
        name: 'Macarons',
        description: 'French almond meringue cookies in assorted flavors',
        price: 280,
        image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=1201&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'cookies',
        ingredients: ['Almond Flour', 'Sugar', 'Egg Whites', 'Buttercream'],
        isVegetarian: true,
        preparationTime: 3,
        rating: 4.8,
        reviews: 278,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Delicate', 'French'],
        nutrition: { calories: 90, protein: '2g', carbs: '15g', fat: '3g' },
        images: [
          'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=1201&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      },
      {
        id: 607,
        restaurantId: 6,
        name: 'Hot Chocolate',
        description: 'Rich, creamy hot chocolate with whipped cream',
        price: 190,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'beverages',
        ingredients: ['Milk', 'Chocolate', 'Whipped Cream', 'Cocoa Powder'],
        isVegetarian: true,
        preparationTime: 4,
        rating: 4.7,
        reviews: 223,
        spiceLevel: 'Mild',
        tags: ['Vegetarian', 'Warm', 'Comforting'],
        nutrition: { calories: 220, protein: '8g', carbs: '25g', fat: '12g' },
        images: [
          'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
      }
    ];

    return allMenuItems.filter(item => item.restaurantId === restaurantId);
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (product) => {
    // Set restaurant context when adding first item
    if (restaurant) {
      setCartRestaurant(restaurant);
    }
    
    addToCart(product, 1, restaurant);
    
    // Show notification
    setCartNotification(product.name);
    setTimeout(() => setCartNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="menu-page">
        <div className="container">
          <div className="loading">Loading menu...</div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="menu-page">
        <div className="container">
          <div className="error">Restaurant not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="container">
        {/* Restaurant Header */}
        <div className="restaurant-header">
          <div className="restaurant-hero">
            <img src={restaurant.image} alt={restaurant.name} className="hero-image" />
            <div className="hero-overlay">
              <button 
                onClick={() => navigate(-1)}
                className="back-btn"
              >
                ← Back to Restaurants
              </button>
            </div>
          </div>
          
          <div className="restaurant-info-card">
            <div className="restaurant-details">
              <h1 className="restaurant-title">{restaurant.name}</h1>
              <p className="restaurant-description">{restaurant.description}</p>
              <p className="restaurant-cuisine">{restaurant.cuisine}</p>
              
              <div className="restaurant-meta">
                <div className="meta-item">
                  <span className="rating">⭐ {restaurant.rating}</span>
                </div>
                <div className="meta-item">
                  <span className="delivery-time">🕒 {restaurant.deliveryTime} min</span>
                </div>
                <div className="meta-item">
                  <span className="delivery-fee">
                    {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="menu-section">
          <h2 className="section-title">
            {selectedCategory === 'all' ? 'All Items' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            <span className="item-count"> ({filteredItems.length} items)</span>
          </h2>
          
          <div className="menu-grid">
            {filteredItems.map(item => (
              <ProductCard 
                key={item.id} 
                product={item} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default Menu;