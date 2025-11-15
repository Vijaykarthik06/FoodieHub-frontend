import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedRestaurant = localStorage.getItem('cartRestaurant');
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart items:', error);
        setCartItems([]);
      }
    }
    
    if (savedRestaurant) {
      try {
        const parsedRestaurant = JSON.parse(savedRestaurant);
        // Validate that parsedRestaurant is an object and has required properties
        if (parsedRestaurant && typeof parsedRestaurant === 'object') {
          setCartRestaurant(parsedRestaurant);
        } else {
          setCartRestaurant(null);
        }
      } catch (error) {
        console.error('Error parsing cart restaurant:', error);
        setCartRestaurant(null);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (cartRestaurant) {
      localStorage.setItem('cartRestaurant', JSON.stringify(cartRestaurant));
    } else {
      localStorage.removeItem('cartRestaurant');
    }
  }, [cartRestaurant]);

  // Function to set the current restaurant for the cart
  const setRestaurant = (restaurant) => {
    if (restaurant && typeof restaurant === 'object') {
      setCartRestaurant(restaurant);
    } else {
      console.error('Invalid restaurant data:', restaurant);
      setCartRestaurant(null);
    }
  };

  // Function to clear the restaurant (when cart is cleared)
  const clearRestaurant = () => {
    setCartRestaurant(null);
  };

  const addToCart = (product, quantity = 1, restaurant) => {
    setCartItems(prevItems => {
      // Check if we're adding from a different restaurant
      if (cartRestaurant && restaurant && cartRestaurant._id !== restaurant._id) {
        if (window.confirm('You have items from a different restaurant. Would you like to clear your cart and add this item?')) {
          // Clear cart and add new item with new restaurant
          setRestaurant(restaurant);
          return [{ ...product, quantity, restaurant: restaurant._id }];
        } else {
          return prevItems;
        }
      }
      
      // If no restaurant is set yet, set it
      if (!cartRestaurant && restaurant) {
        setRestaurant(restaurant);
      }

      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { 
        ...product, 
        quantity, 
        restaurant: restaurant ? restaurant._id : null 
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      
      // If cart is empty after removal, clear the restaurant
      if (updatedItems.length === 0) {
        clearRestaurant();
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    clearRestaurant();
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartRestaurant,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    setCartRestaurant: setRestaurant,
    clearRestaurant
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};