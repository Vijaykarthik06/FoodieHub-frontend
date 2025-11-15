import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [showHover, setShowHover] = useState(false);

  // Safe defaults for missing properties
  const safeProduct = {
    ...product,
    nutrition: product.nutrition || { calories: 0, protein: '0g', carbs: '0g', fat: '0g' },
    reviews: product.reviews || 0,
    spiceLevel: product.spiceLevel || 'Mild',
    tags: product.tags || [],
    ingredients: product.ingredients || [],
    images: product.images || [product.image],
    isVegetarian: product.isVegetarian || false,
    isVegan: product.isVegan || false,
    preparationTime: product.preparationTime || '10-15 mins'
  };

  const handleProductClick = () => {
    navigate(`/product/${safeProduct.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(safeProduct);
  };

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <div className="product-image" onClick={handleProductClick}>
        <img src={safeProduct.image} alt={safeProduct.name} />
        
        {/* Hover Overlay with View Details Text */}
        {showHover && (
          <div className="product-hover-overlay" data-aos="fade-up">
            <div className="view-details-overlay">
              <span className="view-details-text">View Product Details</span>
            </div>
          </div>
        )}

        <div className="product-badges">
          {safeProduct.isVegetarian && <span className="badge vegetarian">🌱 Veg</span>}
          {safeProduct.isVegan && <span className="badge vegan">🌿 Vegan</span>}
          {safeProduct.spiceLevel === 'Medium' && <span className="badge spicy">🌶️ Spicy</span>}
          {safeProduct.spiceLevel === 'Hot' && <span className="badge very-spicy">🔥 Hot</span>}
        </div>
        <div className="product-rating">
          ⭐ {safeProduct.rating} ({safeProduct.reviews})
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name" onClick={handleProductClick}>{safeProduct.name}</h3>
        <p className="product-description">{safeProduct.description}</p>
        
        <div className="product-meta">
          <span className="preparation-time">🕒 {safeProduct.preparationTime}</span>
          <span className="category">{safeProduct.category}</span>
        </div>

        <div className="product-footer">
          <div className="product-price">₹{safeProduct.price.toFixed(2)}</div>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;