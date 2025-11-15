import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const mockProducts = [
        {
          id: 101,
      restaurantId: 1,
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
      price: 140,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'pizza',
      ingredients: ['Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
      nutrition: { calories: 285, protein: '12g', carbs: '35g', fat: '10g' },
      rating: 4.8,
      reviews: 127,
      preparationTime: '15-20 mins',
      cookingTime: '15-20 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Popular', 'Chef Special'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 102,
      restaurantId: 1,
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with pancetta, eggs, and parmesan cheese',
      price: 160,
      image: 'https://plus.unsplash.com/premium_photo-1674511582428-58ce834ce172?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://plus.unsplash.com/premium_photo-1674511582428-58ce834ce172?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1719250726371-b4076d48ce6c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169'
      ],
      category: 'pasta',
      ingredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Parmesan', 'Black Pepper'],
      nutrition: { calories: 420, protein: '18g', carbs: '45g', fat: '16g' },
      rating: 4.6,
      reviews: 89,
      preparationTime: '10-12 mins',
      cookingTime: '12-15 minutes',
      spicyLevel: 'Mild',
      tags: ['Creamy', 'Classic', 'Italian'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 103,
      restaurantId: 1,
      name: 'Chicken Parmesan',
      description: 'Breaded chicken topped with marinara and melted mozzarella',
      price: 250,
      image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1671547329181-8b1925cab127?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070'
      ],
      category: 'main course',
      ingredients: ['Chicken Breast', 'Marinara Sauce', 'Mozzarella', 'Bread Crumbs'],
      nutrition: { calories: 520, protein: '35g', carbs: '28g', fat: '28g' },
      rating: 4.7,
      reviews: 156,
      preparationTime: '15-20 mins',
      cookingTime: '20-25 minutes',
      spicyLevel: 'Mild',
      tags: ['Meat', 'Cheesy', 'Comfort Food'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 104,
      restaurantId: 1,
      name: 'Garlic Breadsticks',
      description: 'Freshly baked breadsticks brushed with garlic butter and herbs',
      price: 110,
      image: 'https://plus.unsplash.com/premium_photo-1711752902734-a36167479983?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://plus.unsplash.com/premium_photo-1711752902734-a36167479983?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1677686707023-9ac1e4f75a87?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
      ],
      category: 'appetizers',
      ingredients: ['Bread dough', 'Garlic', 'Butter', 'Parsley', 'Parmesan'],
      nutrition: { calories: 180, protein: '6g', carbs: '22g', fat: '8g' },
      rating: 4.5,
      reviews: 203,
      preparationTime: '5-8 mins',
      cookingTime: '8-10 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Garlic', 'Baked'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 105,
      restaurantId: 1,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers',
      price: 250,
      image: 'https://images.unsplash.com/photo-1631206753348-db44968fd440?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1631206753348-db44968fd440?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'desserts',
      ingredients: ['Ladyfingers', 'Coffee', 'Mascarpone', 'Cocoa'],
      nutrition: { calories: 320, protein: '8g', carbs: '35g', fat: '18g' },
      rating: 4.9,
      reviews: 278,
      preparationTime: 'Ready to serve',
      cookingTime: 'Pre-made',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Coffee', 'Classic'],
      isVegetarian: true,
      isVegan: false
    },

    // Burger Heaven (ID: 2) - Already completed above
    {
      id: 201,
      restaurantId: 2,
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
      price: 200,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'burgers',
      ingredients: ['Beef Patty', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Special Sauce'],
      nutrition: { calories: 560, protein: '28g', carbs: '35g', fat: '32g' },
      rating: 4.5,
      reviews: 312,
      preparationTime: '8-10 mins',
      cookingTime: '10-12 minutes',
      spicyLevel: 'Mild',
      tags: ['Meat', 'Classic', 'Popular'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 202,
      restaurantId: 2,
      name: 'Bacon BBQ Burger',
      description: 'Beef patty with crispy bacon, BBQ sauce, and onion rings',
      price: 300,
      image: 'https://images.unsplash.com/photo-1556710807-aa697ab9e415?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1556710807-aa697ab9e415?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'burgers',
      ingredients: ['Beef Patty', 'Bacon', 'BBQ Sauce', 'Onion Rings', 'Cheddar'],
      nutrition: { calories: 680, protein: '35g', carbs: '42g', fat: '38g' },
      rating: 4.7,
      reviews: 189,
      preparationTime: '10-12 mins',
      cookingTime: '12-15 minutes',
      spicyLevel: 'Mild',
      tags: ['Meat', 'BBQ', 'Bacon'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 203,
      restaurantId: 2,
      name: 'Crispy Chicken Burger',
      description: 'Crispy fried chicken breast with mayo and pickles',
      price: 420,
      image: 'https://images.unsplash.com/photo-1690749127581-c9351d7d0abc?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1690749127581-c9351d7d0abc?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'burgers',
      ingredients: ['Chicken Breast', 'Mayo', 'Pickles', 'Lettuce', 'Brioche Bun'],
      nutrition: { calories: 520, protein: '32g', carbs: '38g', fat: '25g' },
      rating: 4.4,
      reviews: 167,
      preparationTime: '8-10 mins',
      cookingTime: '11-13 minutes',
      spicyLevel: 'Mild',
      tags: ['Chicken', 'Crispy', 'Popular'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 206,
      restaurantId: 1,
      name: 'Burger Deluxe',
      description: 'Juicy beef patty with premium cheddar cheese, fresh lettuce, ripe tomatoes, and our special signature sauce served on a toasted brioche bun.',
      price: 240,
      image: 'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'burgers',
      ingredients: ['Beef patty', 'Cheddar cheese', 'Lettuce', 'Tomato', 'Special sauce', 'Brioche bun', 'Pickles', 'Red onion'],
      nutrition: { calories: 450, protein: '25g', carbs: '35g', fat: '22g' },
      rating: 4.5,
      reviews: 89,
      preparationTime: '10-15 mins',
      cookingTime: '12-15 minutes',
      spicyLevel: 'Medium',
      tags: ['Meat', 'Popular', 'Best Seller', 'Cheesy', 'Gourmet'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 204,
      restaurantId: 2,
      name: 'French Fries',
      description: 'Golden crispy fries with sea salt',
      price: 130,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'sides',
      ingredients: ['Potatoes', 'Vegetable Oil', 'Sea Salt'],
      nutrition: { calories: 320, protein: '4g', carbs: '42g', fat: '15g' },
      rating: 4.3,
      reviews: 445,
      preparationTime: '5-7 mins',
      cookingTime: '8-10 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Crispy'],
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 205,
      restaurantId: 2,
      name: 'Chocolate Milkshake',
      description: 'Creamy chocolate milkshake with whipped cream',
      price: 180,
      image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'beverages',
      ingredients: ['Vanilla Ice Cream', 'Chocolate Syrup', 'Milk', 'Whipped Cream'],
      nutrition: { calories: 380, protein: '8g', carbs: '45g', fat: '18g' },
      rating: 4.8,
      reviews: 278,
      preparationTime: '3-5 mins',
      cookingTime: 'Ready to serve',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Sweet', 'Creamy'],
      isVegetarian: true,
      isVegan: false
    },

    // Sushi Palace (ID: 3) - Already completed above
    {
      id: 301,
      restaurantId: 3,
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber wrapped in rice and seaweed',
      price: 300,
      image: 'https://plus.unsplash.com/premium_photo-1712949140561-3d0ddacc4e0e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://plus.unsplash.com/premium_photo-1712949140561-3d0ddacc4e0e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'sushi rolls',
      ingredients: ['Crab', 'Avocado', 'Cucumber', 'Rice', 'Seaweed'],
      nutrition: { calories: 290, protein: '9g', carbs: '42g', fat: '8g' },
      rating: 4.6,
      reviews: 234,
      preparationTime: '8-10 mins',
      cookingTime: '10-12 minutes',
      spicyLevel: 'Mild',
      tags: ['Seafood', 'Fresh', 'Popular'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 302,
      restaurantId: 3,
      name: 'Salmon Nigiri',
      description: 'Fresh salmon slices over pressed rice',
      price: 200,
      image: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'nigiri',
      ingredients: ['Salmon', 'Sushi Rice', 'Wasabi'],
      nutrition: { calories: 180, protein: '12g', carbs: '28g', fat: '4g' },
      rating: 4.9,
      reviews: 189,
      preparationTime: '5-7 mins',
      cookingTime: '8-10 minutes',
      spicyLevel: 'Mild',
      tags: ['Seafood', 'Premium', 'Fresh'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 303,
      restaurantId: 3,
      name: 'Spicy Tuna Roll',
      description: 'Spicy tuna with cucumber and spicy mayo',
      price: 320,
      image: 'https://plus.unsplash.com/premium_photo-1712949157780-c308bde2f526?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://plus.unsplash.com/premium_photo-1712949157780-c308bde2f526?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'sushi rolls',
      ingredients: ['Tuna', 'Cucumber', 'Spicy Mayo', 'Rice', 'Seaweed'],
      nutrition: { calories: 320, protein: '15g', carbs: '38g', fat: '12g' },
      rating: 4.7,
      reviews: 156,
      preparationTime: '10-12 mins',
      cookingTime: '12-15 minutes',
      spicyLevel: 'Medium',
      tags: ['Seafood', 'Spicy', 'Popular'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 304,
      restaurantId: 3,
      name: 'Miso Soup',
      description: 'Traditional Japanese soup with tofu and seaweed',
      price: 180,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1610393069309-2607fcf74146?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
      ],
      category: 'soups',
      ingredients: ['Miso Paste', 'Tofu', 'Seaweed', 'Green Onions'],
      nutrition: { calories: 80, protein: '6g', carbs: '8g', fat: '3g' },
      rating: 4.4,
      reviews: 278,
      preparationTime: '3-5 mins',
      cookingTime: '6-8 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Healthy', 'Traditional'],
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 305,
      restaurantId: 3,
      name: 'Edamame',
      description: 'Steamed young soybeans with sea salt',
      price: 260,
      image: 'https://plus.unsplash.com/premium_photo-1666318300285-d97528868ff4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://plus.unsplash.com/premium_photo-1666318300285-d97528868ff4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1666318300285-37575cdfa659?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
      ],
      category: 'appetizers',
      ingredients: ['Edamame', 'Sea Salt'],
      nutrition: { calories: 120, protein: '11g', carbs: '10g', fat: '5g' },
      rating: 4.5,
      reviews: 189,
      preparationTime: '3-5 mins',
      cookingTime: '5-7 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Healthy'],
      isVegetarian: true,
      isVegan: true
    },
    {
  id: 308,
  restaurantId: 1,
  name: 'Caesar Salad',
  description: 'Fresh romaine lettuce with parmesan cheese, croutons, and classic Caesar dressing',
  price: 240,
  image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  images: [
    'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ],
  category: 'salads',
  ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing', 'Black pepper', 'Lemon wedge'],
  nutrition: { calories: 180, protein: '8g', carbs: '12g', fat: '12g' },
  rating: 4.3,
  reviews: 64,
  preparationTime: '8-10 mins',
  cookingTime: '0 minutes',
  spicyLevel: 'Mild',
  tags: ['Healthy', 'Vegetarian', 'Fresh', 'Classic', 'Light'],
  isVegetarian: true,
  isVegan: false
},

    // Taco Fiesta (ID: 4) - Continuing from 401
    {
      id: 401,
      restaurantId: 4,
      name: 'Carne Asada Tacos',
      description: 'Grilled steak tacos with onions, cilantro, and lime',
      price: 230,
      image: 'https://images.unsplash.com/photo-1707603571504-86c1ea50903e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1707603571504-86c1ea50903e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'tacos',
      ingredients: ['Grilled Steak', 'Onions', 'Cilantro', 'Lime', 'Corn Tortillas'],
      nutrition: { calories: 320, protein: '22g', carbs: '25g', fat: '15g' },
      rating: 4.7,
      reviews: 234,
      preparationTime: '6-8 mins',
      cookingTime: '8-10 minutes',
      spicyLevel: 'Medium',
      tags: ['Meat', 'Spicy', 'Traditional'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 402,
      restaurantId: 4,
      name: 'Chicken Quesadilla',
      description: 'Flour tortilla filled with chicken and melted cheese',
      price: 280,
      image: 'https://images.unsplash.com/photo-1628430044262-fb84cffbb744?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1628430044262-fb84cffbb744?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1664391929657-f901ee7f1414?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1053'
      ],
      category: 'quesadillas',
      ingredients: ['Chicken', 'Cheese', 'Flour Tortilla', 'Sour Cream'],
      nutrition: { calories: 420, protein: '25g', carbs: '32g', fat: '22g' },
      rating: 4.5,
      reviews: 167,
      preparationTime: '5-7 mins',
      cookingTime: '7-9 minutes',
      spicyLevel: 'Mild',
      tags: ['Chicken', 'Cheesy', 'Popular'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 403,
      restaurantId: 4,
      name: 'Vegetarian Burrito',
      description: 'Large burrito with rice, beans, and fresh vegetables',
      price: 220,
      image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1592044903782-9836f74027c0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627'
      ],
      category: 'burritos',
      ingredients: ['Rice', 'Black Beans', 'Vegetables', 'Cheese', 'Flour Tortilla'],
      nutrition: { calories: 480, protein: '18g', carbs: '65g', fat: '16g' },
      rating: 4.4,
      reviews: 145,
      preparationTime: '7-9 mins',
      cookingTime: '9-11 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Healthy', 'Filling'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 404,
      restaurantId: 4,
      name: 'Guacamole & Chips',
      description: 'Fresh avocado dip with crispy tortilla chips',
      price: 170,
      image: 'https://images.unsplash.com/photo-1648437595584-62d15da353b7?q=80&w=1134&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1648437595584-62d15da353b7?q=80&w=1134&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1701203236447-89a7016a5a40?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070'
      ],
      category: 'appetizers',
      ingredients: ['Avocado', 'Tomato', 'Onion', 'Lime', 'Tortilla Chips'],
      nutrition: { calories: 280, protein: '4g', carbs: '22g', fat: '20g' },
      rating: 4.6,
      reviews: 278,
      preparationTime: '4-6 mins',
      cookingTime: 'Ready to serve',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Fresh'],
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 405,
      restaurantId: 4,
      name: 'Fish Tacos',
      description: 'Beer-battered fish tacos with cabbage slaw',
      price: 320,
      image: 'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1672976349009-918d041258aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688'
      ],
      category: 'tacos',
      ingredients: ['Fish', 'Cabbage', 'Lime Crema', 'Corn Tortillas'],
      nutrition: { calories: 340, protein: '20g', carbs: '28g', fat: '16g' },
      rating: 4.8,
      reviews: 189,
      preparationTime: '8-10 mins',
      cookingTime: '10-12 minutes',
      spicyLevel: 'Mild',
      tags: ['Seafood', 'Fresh', 'Popular'],
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 406,
      restaurantId: 4,
      name: 'Churros',
      description: 'Cinnamon sugar coated fried dough with chocolate sauce',
      price: 300,
      image: 'https://images.unsplash.com/photo-1669867405064-f31e8707216e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1669867405064-f31e8707216e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1713687789756-b38c7870eef6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
      ],
      category: 'desserts',
      ingredients: ['Flour', 'Cinnamon Sugar', 'Chocolate Sauce'],
      nutrition: { calories: 280, protein: '3g', carbs: '45g', fat: '10g' },
      rating: 4.9,
      reviews: 312,
      preparationTime: '4-6 mins',
      cookingTime: '6-8 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Sweet', 'Traditional'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 407,
      restaurantId: 4,
      name: 'Horchata',
      description: 'Traditional Mexican rice drink with cinnamon',
      price: 240,
      image: 'https://growingupbilingual.com/wp-content/uploads/2023/01/Depositphotos_488216354_XL-e1675165547582.jpg',
      images: [
        'https://growingupbilingual.com/wp-content/uploads/2023/01/Depositphotos_488216354_XL-e1675165547582.jpg',
        'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'beverages',
      ingredients: ['Rice', 'Cinnamon', 'Vanilla', 'Milk'],
      nutrition: { calories: 180, protein: '4g', carbs: '32g', fat: '3g' },
      rating: 4.7,
      reviews: 189,
      preparationTime: '2-3 mins',
      cookingTime: 'Ready to serve',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Refreshing', 'Traditional'],
      isVegetarian: true,
      isVegan: false
    },

    // Green Garden (ID: 5)
    {
      id: 501,
      restaurantId: 5,
      name: 'Quinoa Buddha Bowl',
      description: 'Nutrient-packed bowl with quinoa and fresh vegetables',
      price: 340,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'bowls',
      ingredients: ['Quinoa', 'Avocado', 'Sweet Potato', 'Kale', 'Tahini Dressing'],
      nutrition: { calories: 380, protein: '15g', carbs: '45g', fat: '18g' },
      rating: 4.6,
      reviews: 167,
      preparationTime: '8-10 mins',
      cookingTime: '10-12 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Healthy'],
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 502,
      restaurantId: 5,
      name: 'Vegan Lasagna',
      description: 'Layered pasta with plant-based cheese and vegetables',
      price: 270,
      image: 'https://plus.unsplash.com/premium_photo-1723770033472-0b0452d98225?q=80&w=1097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://plus.unsplash.com/premium_photo-1723770033472-0b0452d98225?q=80&w=1097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'main course',
      ingredients: ['Lasagna Noodles', 'Plant-based Cheese', 'Vegetables', 'Tomato Sauce'],
      nutrition: { calories: 420, protein: '18g', carbs: '52g', fat: '16g' },
      rating: 4.5,
      reviews: 134,
      preparationTime: '12-15 mins',
      cookingTime: '15-18 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Comfort Food'],
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 503,
      restaurantId: 5,
      name: 'Superfood Salad',
      description: 'Mixed greens with berries, nuts, and goat cheese',
      price: 220,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'salads',
      ingredients: ['Mixed Greens', 'Berries', 'Walnuts', 'Goat Cheese', 'Balsamic'],
      nutrition: { calories: 280, protein: '12g', carbs: '22g', fat: '18g' },
      rating: 4.7,
      reviews: 189,
      preparationTime: '6-8 mins',
      cookingTime: 'Ready to serve',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Healthy', 'Fresh'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 504,
      restaurantId: 5,
      name: 'Avocado Toast',
      description: 'Sourdough toast with smashed avocado and microgreens',
      price: 340,
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'breakfast',
      ingredients: ['Sourdough Bread', 'Avocado', 'Microgreens', 'Lemon', 'Chili Flakes'],
      nutrition: { calories: 320, protein: '8g', carbs: '35g', fat: '18g' },
      rating: 4.8,
      reviews: 234,
      preparationTime: '4-6 mins',
      cookingTime: 'Ready to serve',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Healthy'],
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 505,
      restaurantId: 5,
      name: 'Vegetable Stir Fry',
      description: 'Wok-tossed vegetables with tofu and brown rice',
      price: 275,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'main course',
      ingredients: ['Mixed Vegetables', 'Tofu', 'Brown Rice', 'Soy Sauce'],
      nutrition: { calories: 350, protein: '16g', carbs: '48g', fat: '12g' },
      rating: 4.4,
      reviews: 156,
      preparationTime: '10-12 mins',
      cookingTime: '12-15 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Healthy'],
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 506,
      restaurantId: 5,
      name: 'Green Smoothie',
      description: 'Blended kale, spinach, banana, and almond milk',
      price: 210,
      image: 'https://plus.unsplash.com/premium_photo-1700084621249-b22c621ac4e9?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://plus.unsplash.com/premium_photo-1700084621249-b22c621ac4e9?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'beverages',
      ingredients: ['Kale', 'Spinach', 'Banana', 'Almond Milk', 'Chia Seeds'],
      nutrition: { calories: 180, protein: '6g', carbs: '32g', fat: '5g' },
      rating: 4.6,
      reviews: 189,
      preparationTime: '3-5 mins',
      cookingTime: 'Ready to serve',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Healthy'],
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 507,
      restaurantId: 5,
      name: 'Vegan Chocolate Cake',
      description: 'Rich chocolate cake without dairy or eggs',
      price: 400,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'desserts',
      ingredients: ['Flour', 'Cocoa', 'Plant-based Milk', 'Sugar', 'Oil'],
      nutrition: { calories: 320, protein: '4g', carbs: '45g', fat: '14g' },
      rating: 4.9,
      reviews: 278,
      preparationTime: 'Ready to serve',
      cookingTime: 'Pre-made',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Vegan', 'Sweet'],
      isVegetarian: true,
      isVegan: true
    },

    // Sweet Treats (ID: 6)
    {
      id: 601,
      restaurantId: 6,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center and vanilla ice cream',
      price: 320,
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1673551490812-eaee2e9bf0ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
      ],
      category: 'cakes',
      ingredients: ['Chocolate', 'Flour', 'Eggs', 'Butter', 'Vanilla Ice Cream'],
      nutrition: { calories: 420, protein: '6g', carbs: '52g', fat: '22g' },
      rating: 4.9,
      reviews: 445,
      preparationTime: '10-12 mins',
      cookingTime: '12-15 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Sweet', 'Popular'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 602,
      restaurantId: 6,
      name: 'Artisanal Ice Cream',
      description: 'Handcrafted ice cream in various flavors',
      price: 140,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1752962640187-cfd373f4f553?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
      ],
      category: 'ice cream',
      ingredients: ['Cream', 'Sugar', 'Flavorings'],
      nutrition: { calories: 280, protein: '4g', carbs: '32g', fat: '15g' },
      rating: 4.8,
      reviews: 312,
      preparationTime: 'Ready to serve',
      cookingTime: 'Pre-made',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Cold', 'Sweet'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 603,
      restaurantId: 6,
      name: 'Fresh Croissants',
      description: 'Buttery, flaky French croissants',
      price: 180,
      image: 'https://images.unsplash.com/photo-1747459707225-65744d0ae6be?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1747459707225-65744d0ae6be?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1733997926055-fdb6ba24692b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1331'
      ],
      category: 'pastries',
      ingredients: ['Flour', 'Butter', 'Yeast', 'Milk'],
      nutrition: { calories: 320, protein: '6g', carbs: '35g', fat: '18g' },
      rating: 4.7,
      reviews: 278,
      preparationTime: 'Ready to serve',
      cookingTime: 'Pre-made',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Buttery', 'Flaky'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 604,
      restaurantId: 6,
      name: 'Fruit Tart',
      description: 'Shortcrust pastry with custard and fresh fruits',
      price: 220,
      image: 'https://plus.unsplash.com/premium_photo-1664472613567-2176b50ddb28?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://plus.unsplash.com/premium_photo-1664472613567-2176b50ddb28?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1620980776848-84ac10194945?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
      ],
      category: 'tarts',
      ingredients: ['Shortcrust Pastry', 'Custard', 'Fresh Fruits', 'Glaze'],
      nutrition: { calories: 280, protein: '4g', carbs: '38g', fat: '12g' },
      rating: 4.6,
      reviews: 189,
      preparationTime: 'Ready to serve',
      cookingTime: 'Pre-made',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Fruity', 'Fresh'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 605,
      restaurantId: 6,
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake with berry compote',
      price: 280,
      image: 'https://images.unsplash.com/photo-1702925614886-50ad13c88d3f?q=80&w=789&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1702925614886-50ad13c88d3f?q=80&w=789&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1722686461601-b2a018a4213b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=955'
      ],
      category: 'cakes',
      ingredients: ['Cream Cheese', 'Graham Cracker Crust', 'Eggs', 'Sugar', 'Berries'],
      nutrition: { calories: 380, protein: '8g', carbs: '42g', fat: '20g' },
      rating: 4.9,
      reviews: 334,
      preparationTime: 'Ready to serve',
      cookingTime: 'Pre-made',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Creamy', 'Popular'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 606,
      restaurantId: 6,
      name: 'Macarons',
      description: 'French almond meringue cookies in assorted flavors',
      price: 280,
      image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=1201&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=1201&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1675806021714-8f33e130a28a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765'
      ],
      category: 'cookies',
      ingredients: ['Almond Flour', 'Sugar', 'Egg Whites', 'Buttercream'],
      nutrition: { calories: 90, protein: '2g', carbs: '15g', fat: '3g' },
      rating: 4.8,
      reviews: 278,
      preparationTime: 'Ready to serve',
      cookingTime: 'Pre-made',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Delicate', 'French'],
      isVegetarian: true,
      isVegan: false
    },
    {
      id: 607,
      restaurantId: 6,
      name: 'Hot Chocolate',
      description: 'Rich, creamy hot chocolate with whipped cream',
      price: 190,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974'
      ],
      category: 'beverages',
      ingredients: ['Milk', 'Chocolate', 'Whipped Cream', 'Cocoa Powder'],
      nutrition: { calories: 220, protein: '8g', carbs: '25g', fat: '12g' },
      rating: 4.7,
      reviews: 223,
      preparationTime: '3-5 mins',
      cookingTime: 'Ready to serve',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Warm', 'Comforting'],
      isVegetarian: true,
      isVegan: false
    }
  ];

  useEffect(() => {
    const fetchProduct = () => {
      setLoading(true);
      setTimeout(() => {
        // Convert id to number and find the product
        const productId = parseInt(id);
        const foundProduct = mockProducts.find(product => product.id === productId);
        setProduct(foundProduct);
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [id]); // Add id as dependency

  const handleAddToCart = () => {
    if (product) {
      const itemToAdd = {
        ...product,
        quantity: quantity
      };
      addToCart(itemToAdd);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/menu')}>Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`₹{product.name} view ₹{index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-meta">
                <span className="rating">⭐ {product.rating} ({product.reviews} reviews)</span>
                <span className="category">{product.category}</span>
              </div>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-details">
              <div className="detail-item">
                <strong>Preparation Time:</strong> {product.preparationTime}
              </div>
              <div className="detail-item">
                <strong>Spicy Level:</strong> {product.spicyLevel}
              </div>
            </div>

            <div className="ingredients">
              <h3>Ingredients</h3>
              <ul>
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="purchase-section">
              <div className="price">₹{product.price.toFixed(2)}</div>
              
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>

              <button className="add-to-cart-btn large" onClick={handleAddToCart}>
                Add to Cart - ₹{(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;