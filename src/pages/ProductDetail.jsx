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
          id: 1,
          name: 'Margherita Pizza',
          description: 'Classic Italian pizza with fresh tomato sauce, mozzarella cheese, and basil leaves. Our signature dish made with love and traditional recipes.',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          images: [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          ],
          category: 'pizza',
          ingredients: ['Tomato sauce', 'Mozzarella cheese', 'Fresh basil', 'Olive oil'],
          nutrition: { calories: 285, protein: '12g', carbs: '35g', fat: '10g' },
          rating: 4.8,
          reviews: 127,
          preparationTime: '20-25 mins',
          cookingTime: '15-20 minutes',
          spicyLevel: 'Mild',
          tags: ['Vegetarian', 'Popular', 'Chef Special']
        },
        {
          id: 2,
          name: 'Pepperoni Pizza',
          description: 'A classic favorite with spicy pepperoni, rich tomato sauce, and melted mozzarella cheese. Perfect for meat lovers!',
          price: 14.99,
          image: 'https://plus.unsplash.com/premium_photo-1674147605295-53b30e11d8c0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          images: [
            'https://plus.unsplash.com/premium_photo-1674147605295-53b30e11d8c0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          ],
          category: 'pizza',
          ingredients: ['Tomato sauce', 'Mozzarella cheese', 'Pepperoni', 'Italian herbs'],
          nutrition: { calories: 320, protein: '15g', carbs: '38g', fat: '14g' },
          rating: 4.6,
          reviews: 89,
          preparationTime: '20-25 mins',
          cookingTime: '15-20 minutes',
          spicyLevel: 'Medium',
          tags: ['Meat', 'Popular', 'Spicy']
        },
        {
          id: 3,
          name: 'Burger Deluxe',
          description: 'Juicy beef patty with premium cheddar cheese, fresh lettuce, ripe tomatoes, and our special signature sauce served on a toasted brioche bun.',
          price: 9.99,
          image: 'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          images: [
            'https://images.unsplash.com/photo-1613160775054-d4a634592b7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          ],
          category: 'burgers',
          ingredients: ['Beef patty', 'Cheddar cheese', 'Lettuce', 'Tomato', 'Special sauce', 'Brioche bun', 'Pickles', 'Onions'],
          nutrition: { calories: 560, protein: '28g', carbs: '45g', fat: '28g' },
          rating: 4.4,
          reviews: 203,
          preparationTime: '12-15 mins',
          cookingTime: '10-15 minutes',
          spicyLevel: 'Mild',
          tags: ['Meat', 'Popular', 'Premium']
        },
        {
          id: 4,
          name: 'Veggie Burger',
          description: 'Plant-based burger patty with fresh avocado, spinach, tomatoes, and cucumber on a whole wheat bun. A healthy and delicious alternative!',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1290&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          images: [
            'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1290&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          ],
          category: 'burgers',
          ingredients: ['Plant-based patty', 'Avocado', 'Spinach', 'Tomato', 'Cucumber', 'Whole wheat bun', 'Vegan mayo'],
          nutrition: { calories: 420, protein: '18g', carbs: '35g', fat: '22g' },
          rating: 4.2,
          reviews: 156,
          preparationTime: '10-12 mins',
          cookingTime: '8-12 minutes',
          spicyLevel: 'Mild',
          tags: ['Vegetarian', 'Healthy', 'Plant-based']
        },
        {
          id: 5,
          name: 'Caesar Salad',
          description: 'Fresh crisp romaine lettuce with shaved parmesan cheese, homemade croutons, and our classic Caesar dressing topped with lemon zest.',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          images: [
            'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          ],
          category: 'salads',
          ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing', 'Lemon juice', 'Black pepper', 'Anchovy paste'],
          nutrition: { calories: 320, protein: '14g', carbs: '18g', fat: '22g' },
          rating: 4.5,
          reviews: 89,
          preparationTime: '5-7 mins',
          cookingTime: '5 minutes',
          spicyLevel: 'Mild',
          tags: ['Vegetarian', 'Fresh', 'Classic']
        },
        {
          id: 6,
          name: 'Greek Salad',
          description: 'Traditional Greek salad with cucumbers, tomatoes, Kalamata olives, red onions, and authentic feta cheese drizzled with olive oil.',
          price: 7.99,
          image: 'https://images.unsplash.com/photo-1549745708-fa4a8423a0b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          images: [
            'https://images.unsplash.com/photo-1549745708-fa4a8423a0b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1515536765-9b2f14a0e7c3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          ],
          category: 'salads',
          ingredients: ['Cucumbers', 'Tomatoes', 'Kalamata olives', 'Feta cheese', 'Red onion', 'Olive oil', 'Oregano', 'Bell peppers'],
          nutrition: { calories: 280, protein: '10g', carbs: '12g', fat: '22g' },
          rating: 4.3,
          reviews: 67,
          preparationTime: '5-7 mins',
          cookingTime: '5 minutes',
          spicyLevel: 'Mild',
          tags: ['Vegetarian', 'Mediterranean', 'Healthy']
        },
        {
          id: 7,
          name: 'Chocolate Cake',
          description: 'Rich, moist chocolate cake layered with creamy chocolate frosting. A decadent dessert that satisfies every chocolate craving.',
          price: 5.99,
          image: 'https://images.unsplash.com/photo-1655411880489-2f0d18785863?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          images: [
            'https://images.unsplash.com/photo-1655411880489-2f0d18785863?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          ],
          category: 'desserts',
          ingredients: ['Chocolate', 'Flour', 'Sugar', 'Eggs', 'Butter', 'Cocoa powder', 'Vanilla extract', 'Heavy cream'],
          nutrition: { calories: 450, protein: '6g', carbs: '65g', fat: '20g' },
          rating: 4.9,
          reviews: 312,
          preparationTime: 'Ready to serve',
          cookingTime: 'Pre-made',
          spicyLevel: 'Mild',
          tags: ['Vegetarian', 'Sweet', 'Popular']
        },
        {
          id: 8,
          name: 'Ice Cream Sundae',
          description: 'Premium vanilla ice cream topped with rich chocolate sauce, crunchy mixed nuts, whipped cream, and a cherry on top.',
          price: 4.99,
          image: 'https://images.unsplash.com/photo-1657225953401-5f95007fc8e0?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          images: [
            'https://images.unsplash.com/photo-1657225953401-5f95007fc8e0?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          ],
          category: 'desserts',
          ingredients: ['Vanilla ice cream', 'Chocolate sauce', 'Mixed nuts', 'Whipped cream', 'Cherry', 'Caramel syrup'],
          nutrition: { calories: 380, protein: '8g', carbs: '45g', fat: '18g' },
          rating: 4.7,
          reviews: 178,
          preparationTime: '2-3 mins',
          cookingTime: '2 minutes',
          spicyLevel: 'Mild',
          tags: ['Vegetarian', 'Cold', 'Sweet']
        },
        {
      id: 9,
      name: 'Chicken Tikka Masala',
      description: 'Tender chicken pieces in a rich and creamy tomato-based sauce with aromatic Indian spices, served with basmati rice.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'indian',
      ingredients: ['Chicken', 'Tomato sauce', 'Cream', 'Garam masala', 'Ginger', 'Garlic', 'Basmati rice'],
      nutrition: { calories: 420, protein: '35g', carbs: '25g', fat: '22g' },
      rating: 4.7,
      reviews: 189,
      preparationTime: '25-30 mins',
      cookingTime: '20-25 minutes',
      spicyLevel: 'Medium',
      tags: ['Spicy', 'Popular', 'Creamy']
    },
    {
      id: 10,
      name: 'Sushi Platter',
      description: 'Assorted fresh sushi including salmon nigiri, tuna rolls, California rolls, and vegetable maki with wasabi and soy sauce.',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'japanese',
      ingredients: ['Salmon', 'Tuna', 'Rice', 'Nori', 'Avocado', 'Cucumber', 'Soy sauce', 'Wasabi'],
      nutrition: { calories: 380, protein: '22g', carbs: '45g', fat: '12g' },
      rating: 4.8,
      reviews: 234,
      preparationTime: '15-20 mins',
      cookingTime: '10-15 minutes',
      spicyLevel: 'Mild',
      tags: ['Fresh', 'Healthy', 'Premium']
    },
    {
      id: 11,
      name: 'Beef Tacos',
      description: 'Three soft tortillas filled with seasoned ground beef, lettuce, tomatoes, cheese, and sour cream with a side of salsa.',
      price: 10.99,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'mexican',
      ingredients: ['Ground beef', 'Tortillas', 'Lettuce', 'Tomato', 'Cheese', 'Sour cream', 'Salsa', 'Taco seasoning'],
      nutrition: { calories: 520, protein: '28g', carbs: '35g', fat: '28g' },
      rating: 4.4,
      reviews: 167,
      preparationTime: '12-15 mins',
      cookingTime: '10-12 minutes',
      spicyLevel: 'Medium',
      tags: ['Spicy', 'Mexican', 'Popular']
    },
    {
      id: 12,
      name: 'Pad Thai',
      description: 'Classic Thai stir-fried rice noodles with shrimp, tofu, bean sprouts, peanuts, and eggs in a tangy tamarind sauce.',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1707546944460-dda9069b9c1e?q=80&w=737&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'thai',
      ingredients: ['Rice noodles', 'Shrimp', 'Tofu', 'Bean sprouts', 'Peanuts', 'Eggs', 'Tamarind sauce', 'Lime'],
      nutrition: { calories: 480, protein: '24g', carbs: '65g', fat: '15g' },
      rating: 4.6,
      reviews: 198,
      preparationTime: '15-18 mins',
      cookingTime: '12-15 minutes',
      spicyLevel: 'Medium',
      tags: ['Spicy', 'Thai', 'Noodles']
    },
    {
      id: 13,
      name: 'BBQ Ribs',
      description: 'Slow-cooked pork ribs glazed with homemade barbecue sauce, served with coleslaw and french fries.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'american',
      ingredients: ['Pork ribs', 'BBQ sauce', 'Coleslaw', 'French fries', 'Spices', 'Honey', 'Brown sugar'],
      nutrition: { calories: 680, protein: '42g', carbs: '45g', fat: '38g' },
      rating: 4.5,
      reviews: 276,
      preparationTime: '30-35 mins',
      cookingTime: '25-30 minutes',
      spicyLevel: 'Mild',
      tags: ['Meat', 'BBQ', 'Popular']
    },
    {
      id: 14,
      name: 'Mushroom Risotto',
      description: 'Creamy Arborio rice cooked with assorted wild mushrooms, parmesan cheese, white wine, and fresh herbs.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1609770424775-39ec362f2d94?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'italian',
      ingredients: ['Arborio rice', 'Wild mushrooms', 'Parmesan cheese', 'White wine', 'Vegetable broth', 'Onion', 'Garlic', 'Herbs'],
      nutrition: { calories: 420, protein: '14g', carbs: '55g', fat: '16g' },
      rating: 4.3,
      reviews: 134,
      preparationTime: '25-30 mins',
      cookingTime: '20-25 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Creamy', 'Gourmet']
    },
    {
      id: 15,
      name: 'Fish and Chips',
      description: 'Beer-battered cod fillets deep-fried to golden perfection, served with thick-cut fries, tartar sauce, and lemon wedges.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1579208030886-b937da0925dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1706711053549-f52f73a8960c?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'british',
      ingredients: ['Cod fillets', 'Beer batter', 'Potatoes', 'Tartar sauce', 'Lemon', 'Parsley', 'Malt vinegar'],
      nutrition: { calories: 620, protein: '32g', carbs: '48g', fat: '32g' },
      rating: 4.4,
      reviews: 189,
      preparationTime: '20-25 mins',
      cookingTime: '15-18 minutes',
      spicyLevel: 'Mild',
      tags: ['Seafood', 'Crispy', 'Classic']
    },
    {
      id: 16,
      name: 'Vegetable Stir Fry',
      description: 'Fresh seasonal vegetables stir-fried in a light soy-ginger sauce, served over steamed jasmine rice.',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1664478238082-3df93e48c491?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'asian',
      ingredients: ['Mixed vegetables', 'Bell peppers', 'Broccoli', 'Carrots', 'Soy sauce', 'Ginger', 'Garlic', 'Jasmine rice'],
      nutrition: { calories: 320, protein: '12g', carbs: '45g', fat: '8g' },
      rating: 4.2,
      reviews: 145,
      preparationTime: '10-12 mins',
      cookingTime: '8-10 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Healthy', 'Light']
    },
    {
      id: 17,
      name: 'Chicken Alfredo Pasta',
      description: 'Fettuccine pasta tossed in a creamy Alfredo sauce with grilled chicken breast, parmesan cheese, and fresh parsley.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'italian',
      ingredients: ['Fettuccine pasta', 'Chicken breast', 'Heavy cream', 'Parmesan cheese', 'Butter', 'Garlic', 'Parsley'],
      nutrition: { calories: 580, protein: '38g', carbs: '45g', fat: '28g' },
      rating: 4.6,
      reviews: 223,
      preparationTime: '20-25 mins',
      cookingTime: '15-18 minutes',
      spicyLevel: 'Mild',
      tags: ['Creamy', 'Popular', 'Comfort Food']
    },
    {
      id: 18,
      name: 'Mango Lassi',
      description: 'Refreshing traditional Indian yogurt drink made with sweet mango pulp, yogurt, and a hint of cardamom.',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'beverages',
      ingredients: ['Mango pulp', 'Yogurt', 'Milk', 'Sugar', 'Cardamom', 'Ice'],
      nutrition: { calories: 180, protein: '8g', carbs: '28g', fat: '4g' },
      rating: 4.7,
      reviews: 167,
      preparationTime: '3-5 mins',
      cookingTime: '2 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Refreshing', 'Sweet']
    },
    {
      id: 19,
      name: 'Beef Pho',
      description: 'Traditional Vietnamese noodle soup with slow-cooked beef broth, rice noodles, thinly sliced beef, and fresh herbs.',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'vietnamese',
      ingredients: ['Beef broth', 'Rice noodles', 'Beef slices', 'Bean sprouts', 'Basil', 'Mint', 'Lime', 'Chili'],
      nutrition: { calories: 380, protein: '26g', carbs: '42g', fat: '12g' },
      rating: 4.5,
      reviews: 198,
      preparationTime: '15-20 mins',
      cookingTime: '12-15 minutes',
      spicyLevel: 'Medium',
      tags: ['Soup', 'Healthy', 'Aromatic']
    },
    {
      id: 20,
      name: 'Falafel Wrap',
      description: 'Crispy falafel balls wrapped in warm pita bread with fresh vegetables, tahini sauce, and pickled turnips.',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      images: [
        'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      category: 'mediterranean',
      ingredients: ['Falafel', 'Pita bread', 'Lettuce', 'Tomato', 'Cucumber', 'Tahini sauce', 'Pickles', 'Parsley'],
      nutrition: { calories: 420, protein: '15g', carbs: '55g', fat: '16g' },
      rating: 4.3,
      reviews: 156,
      preparationTime: '10-12 mins',
      cookingTime: '8-10 minutes',
      spicyLevel: 'Mild',
      tags: ['Vegetarian', 'Healthy', 'Mediterranean']
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
                  alt={`${product.name} view ${index + 1}`}
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
              <div className="price">${product.price.toFixed(2)}</div>
              
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>

              <button className="add-to-cart-btn large" onClick={handleAddToCart}>
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;