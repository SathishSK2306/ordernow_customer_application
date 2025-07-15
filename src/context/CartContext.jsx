import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [orderType, setOrderType] = useState("dine-in"); // "dine-in" or "pickup"
  const [favorites, setFavorites] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  const [personalNotes, setPersonalNotes] = useState({});

  // Constants for calculations
  const GST_RATE = 0.05; // 5% GST
  const PARCEL_CHARGE = 20; // ₹20 for parcel/pickup

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ordernow_cart');
    const savedFavorites = localStorage.getItem('ordernow_favorites');
    const savedOrderHistory = localStorage.getItem('ordernow_order_history');

    const savedPersonalNotes = localStorage.getItem('ordernow_personal_notes');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing saved favorites:', error);
      }
    }

    if (savedOrderHistory) {
      try {
        setOrderHistory(JSON.parse(savedOrderHistory));
      } catch (error) {
        console.error('Error parsing saved order history:', error);
      }
    }



    if (savedPersonalNotes) {
      try {
        setPersonalNotes(JSON.parse(savedPersonalNotes));
      } catch (error) {
        console.error('Error parsing saved personal notes:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ordernow_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ordernow_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save order history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ordernow_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);



  // Save personal notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ordernow_personal_notes', JSON.stringify(personalNotes));
  }, [personalNotes]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });

    // Set the last added item for animation
    setLastAddedItem(item);
    
    // Reset last added item after animation completes
    setTimeout(() => setLastAddedItem(null), 1000);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Set order type (dine-in or pickup)
  const setOrderTypeOption = (type) => {
    setOrderType(type);
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if an item is in the cart
  const isInCart = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };

  // Calculate subtotal (before tax and fees)
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate GST amount
  const getGstAmount = () => {
    return getSubtotal() * GST_RATE;
  };

  // Calculate parcel charges if applicable
  const getParcelCharges = () => {
    return orderType === "pickup" ? PARCEL_CHARGE : 0;
  };

  // Calculate total price including GST and parcel charges
  const getTotalPrice = () => {
    return getSubtotal() + getGstAmount() + getParcelCharges();
  };

  // Favorites Management
  const toggleFavorite = (item) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === item.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter(fav => fav.id !== item.id);
      } else {
        return [...prevFavorites, item];
      }
    });
  };

  const isFavorite = (itemId) => {
    return favorites.some(fav => fav.id === itemId);
  };

  const getFavorites = () => {
    return favorites;
  };

  // Personal Notes Management
  const setPersonalNote = (itemId, note) => {
    setPersonalNotes((prevNotes) => ({
      ...prevNotes,
      [itemId]: note
    }));
  };

  const getPersonalNote = (itemId) => {
    return personalNotes[itemId] || '';
  };

  const removePersonalNote = (itemId) => {
    setPersonalNotes((prevNotes) => {
      const newNotes = { ...prevNotes };
      delete newNotes[itemId];
      return newNotes;
    });
  };



  // Order History Management
  const addToOrderHistory = (order) => {
    const newOrder = {
      id: Date.now(),
      items: [...cartItems],
      orderType,
      subtotal: getSubtotal(),
      gst: getGstAmount(),
      parcelCharges: getParcelCharges(),
      total: getTotalPrice(),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    setOrderHistory((prevHistory) => [newOrder, ...prevHistory]);
    return newOrder;
  };

  const getOrderHistory = () => {
    return orderHistory;
  };

  const reorderFromHistory = (order) => {
    // Clear current cart and add items from the historical order
    setCartItems([...order.items]);
    setOrderType(order.orderType);
  };

  const getRecentOrders = (limit = 5) => {
    return orderHistory.slice(0, limit);
  };

  // Save cart for later functionality
  const saveCartForLater = () => {
    const savedCart = {
      items: [...cartItems],
      orderType,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('ordernow_saved_cart', JSON.stringify(savedCart));
    return savedCart;
  };

  const loadSavedCart = () => {
    const savedCart = localStorage.getItem('ordernow_saved_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart.items);
        setOrderType(parsedCart.orderType);
        return parsedCart;
      } catch (error) {
        console.error('Error loading saved cart:', error);
        return null;
      }
    }
    return null;
  };

  const getSavedCart = () => {
    const savedCart = localStorage.getItem('ordernow_saved_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        return null;
      }
    }
    return null;
  };

  const clearSavedCart = () => {
    localStorage.removeItem('ordernow_saved_cart');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orderType,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setOrderType: setOrderTypeOption,
        getCartCount,
        isInCart,
        getSubtotal,
        getGstAmount,
        getParcelCharges,
        getTotalPrice,
        lastAddedItem,
        // Favorites
        favorites,
        toggleFavorite,
        isFavorite,
        getFavorites,
        // Personal Notes
        setPersonalNote,
        getPersonalNote,
        removePersonalNote,

        // Order History
        addToOrderHistory,
        getOrderHistory,
        reorderFromHistory,
        getRecentOrders,
        // Save Cart for Later
        saveCartForLater,
        loadSavedCart,
        getSavedCart,
        clearSavedCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;