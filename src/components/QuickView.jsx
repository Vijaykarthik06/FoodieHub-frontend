// QuickView.js
import React from 'react';
import './QuickView.css';

const QuickView = ({ product, onClose, onViewDetails }) => {
  return (
    <div className="quick-view-overlay">
      <div className="quick-view-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="quick-view-content">
          <img src={product.image} alt={product.name} />
          <div className="quick-view-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div className="price">${product.price.toFixed(2)}</div>
            
            <div className="quick-view-actions">
              <button 
                className="view-details-btn"
                onClick={() => onViewDetails(product.id)} // This should navigate to product details
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;