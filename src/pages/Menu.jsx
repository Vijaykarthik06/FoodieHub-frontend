import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import './Menu.css';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = () => {
      
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
        }
      ];

       setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      
      const uniqueCategories = [...new Set(mockProducts.map(product => product.category))];
      setCategories(['all', ...uniqueCategories]);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Your existing filtering and sorting logic
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, searchTerm]);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
    handleCloseQuickView();
  };

  return (
    <div className="menu-page">
      <div className="container">
        <h1 className="page-title">Our Menu</h1>
        
        <div className="menu-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={() => handleQuickView(product)}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <QuickView 
          product={quickViewProduct}
          onClose={handleCloseQuickView}
          onViewDetails={() => handleViewDetails(quickViewProduct.id)} // Fix: pass the actual product ID
        />
      )}
    </div>
  );
};

export default Menu;