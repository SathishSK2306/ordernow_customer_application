import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaChevronUp, FaTrash, FaMinus, FaPlus, FaSave, FaHistory, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useOrderQueue } from "../context/OrderQueueContext";
import Checkout from "./Checkout";
import OrderTracking from "./OrderTracking";

const FloatingCart = ({ itemCount = 0 }) => {
  const { 
    cartItems, 
    orderType,
    removeFromCart, 
    updateQuantity,
    setOrderType,
    getSubtotal,
    getGstAmount,
    getParcelCharges,
    getTotalPrice,
    clearCart,
    saveCartForLater,
    loadSavedCart,
    getSavedCart,
    addToOrderHistory
  } = useCart();

  const { calculateWaitingTime } = useOrderQueue();
  
  const cartRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);
  const [showPreview, setShowPreview] = useState(false);
  const [animationPosition, setAnimationPosition] = useState({ x: 50, y: -50 });
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);

  // Detect when a new item is added to the cart
  useEffect(() => {
    if (itemCount > prevCount) {
      // Set random starting position for the animation
      setAnimationPosition({
        x: Math.random() * 100 + 50, // Random position right of the cart
        y: Math.random() * -100 - 50, // Random position above the cart
      });
      
      setIsAnimating(true);
      // Reset animation state after animation completes
      setTimeout(() => setIsAnimating(false), 1000);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  // Calculate estimated wait time whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      const waitTime = calculateWaitingTime(cartItems);
      setEstimatedWaitTime(waitTime);
    }
  }, [cartItems, calculateWaitingTime]);

  // Add click outside listener to close the cart
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowPreview(false);
      }
    }

    // Add event listener when cart is open
    if (showPreview) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPreview]);

  // Get calculated values from context
  const subtotal = getSubtotal();
  const gstAmount = getGstAmount();
  const parcelCharges = getParcelCharges();
  const totalPrice = getTotalPrice();

  // Handle quantity change
  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    updateQuantity(item.id, newQuantity);
  };

  // Toggle cart preview
  const toggleCart = () => {
    setShowPreview(!showPreview);
  };

  // Handle save cart for later
  const handleSaveCart = () => {
    saveCartForLater();
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  // Handle load saved cart
  const handleLoadSavedCart = () => {
    loadSavedCart();
    setShowPreview(false);
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (showClearConfirm) {
      clearCart();
      setShowClearConfirm(false);
      setShowPreview(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    setShowCheckout(true);
    setShowPreview(false);
  };

  // Handle order placement
  const handleOrderPlaced = (order) => {
    setCurrentOrderId(order.id);
    setShowCheckout(false);
    setShowOrderTracking(true);
  };

  // Check if there's a saved cart
  const savedCart = getSavedCart();

  return (
    <div className="fixed bottom-6 left-6 z-50" ref={cartRef}>
      {/* Cart preview panel */}
      <AnimatePresence>
        {showPreview && cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="bg-white rounded-lg shadow-xl p-4 mb-3 w-80 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b">
              <h3 className="font-bold text-gray-800">Your Cart</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{itemCount} items</span>
                <button
                  onClick={handleClearCart}
                  className={`p-1 rounded transition-colors ${
                    showClearConfirm 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                  title={showClearConfirm ? 'Click again to confirm' : 'Clear cart'}
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 border-b pb-3">
                  <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button 
                          onClick={() => handleQuantityChange(item, -1)}
                          className="px-2 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item, 1)}
                          className="px-2 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-gold-500">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Estimated Wait Time */}
            <div className="mt-4 mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <FaClock className="text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Estimated Wait Time</p>
                  <p className="text-lg font-bold text-yellow-600">{estimatedWaitTime} minutes</p>
                </div>
              </div>
            </div>

            {/* Order type selection */}
            <div className="mt-4 mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Order Type:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderType("dine-in")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    orderType === "dine-in" 
                      ? "bg-gold-500 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Dine In
                </button>
                <button
                  onClick={() => setOrderType("pickup")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    orderType === "pickup" 
                      ? "bg-gold-500 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Pickup
                </button>
              </div>
              {orderType === "pickup" && (
                <p className="text-xs text-gray-500 mt-1">
                  * Additional parcel charges of ₹20 will be applied
                </p>
              )}
            </div>
            
            {/* Price breakdown */}
            <div className="mt-3 pt-2 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (5%):</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              {orderType === "pickup" && (
                <div className="flex justify-between text-sm">
                  <span>Parcel Charges:</span>
                  <span>₹{parcelCharges.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-gold-500">₹{totalPrice.toFixed(2)}</span>
              </div>
              {/* Cart action buttons */}
              <div className="flex gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveCart}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md font-medium text-sm flex items-center justify-center gap-1"
                >
                  <FaSave size={12} />
                  Save for Later
                </motion.button>
                
                {savedCart && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLoadSavedCart}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <FaHistory size={12} />
                    Load Saved
                  </motion.button>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full mt-2 bg-gold-500 hover:bg-gold-600 text-white py-2 rounded-md font-medium"
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save message notification */}
      <AnimatePresence>
        {showSaveMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-green-500 text-white px-3 py-2 rounded-lg mb-3 text-sm"
          >
            Cart saved for later! 💾
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating cart icon */}
      <motion.div
        onClick={toggleCart}
        className="relative bg-gold-500 text-white p-4 rounded-full shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {showPreview ? <FaChevronUp size={24} /> : <FaShoppingCart size={24} />}
        
        {/* Item count badge */}
        {itemCount > 0 && (
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
          >
            {itemCount}
          </motion.div>
        )}
      </motion.div>

      {/* Animation for items jumping into cart */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute h-6 w-6 bg-gold-600 rounded-full"
            initial={{ 
              top: `${animationPosition.y}px`, 
              left: `${animationPosition.x}px`,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              top: "50%", 
              left: "50%",
              scale: [0.5, 1, 0.8, 0.5, 0.2, 0],
              opacity: [0, 1, 1, 1, 0.5, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 0.8, 1]
            }}
          />
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          onOrderPlaced={handleOrderPlaced}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* Order Tracking Modal */}
      {showOrderTracking && currentOrderId && (
        <OrderTracking
          orderId={currentOrderId}
          onClose={() => {
            setShowOrderTracking(false);
            setCurrentOrderId(null);
          }}
        />
      )}
    </div>
  );
};

export default FloatingCart;