import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useOrderQueue } from "../context/OrderQueueContext";
import { FaClock, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";

const Checkout = ({ onOrderPlaced, onClose }) => {
  const { cartItems, getTotalPrice, clearCart, orderType } = useCart();
  const { calculateWaitingTime, addToQueue } = useOrderQueue();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: orderType === 'pickup' ? '' : ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);

  // Calculate estimated wait time
  useEffect(() => {
    if (cartItems.length > 0) {
      const waitTime = calculateWaitingTime(cartItems);
      setEstimatedWaitTime(waitTime);
    }
  }, [cartItems, calculateWaitingTime]);

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Add order to queue
      const order = addToQueue(cartItems, customerInfo);
      
      // Clear cart
      clearCart();
      
      // Call success callback
      if (onOrderPlaced) {
        onOrderPlaced(order);
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <FaShoppingCart className="mx-auto text-4xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <button
              onClick={onClose}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Estimated Wait Time */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaClock className="text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-800">Estimated Wait Time</p>
              <p className="text-xl font-bold text-yellow-600">
                {estimatedWaitTime} minutes
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-yellow-600">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-yellow-600">₹{getTotalPrice()}</span>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUser className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaPhone className="inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaEnvelope className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your email address"
            />
          </div>

          {orderType === 'pickup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaMapMarkerAlt className="inline mr-2" />
                Address
              </label>
              <textarea
                value={customerInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows="3"
                placeholder="Enter your address"
              />
            </div>
          )}

          {/* Order Type Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Order Type:</p>
            <p className="font-semibold text-gray-800 capitalize">{orderType}</p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-yellow-500 hover:bg-yellow-600'
              } text-white py-3 px-4 rounded-lg transition-colors`}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>

        {/* Order Processing Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> After placing your order, you'll receive real-time updates about your order status. 
            You'll be notified when your order is being prepared, when it's almost ready, and when it's ready for pickup.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;