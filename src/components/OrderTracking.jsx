import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderQueue } from "../context/OrderQueueContext";
import { FaClock, FaUtensils, FaFire, FaCheckCircle, FaBell } from "react-icons/fa";

const OrderTracking = ({ orderId, onClose }) => {
  const { getCurrentOrderStatus, notifications } = useOrderQueue();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      const updatedOrder = getCurrentOrderStatus(orderId);
      setOrder(updatedOrder);
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId, getCurrentOrderStatus]);

  useEffect(() => {
    const initialOrder = getCurrentOrderStatus(orderId);
    setOrder(initialOrder);
  }, [orderId, getCurrentOrderStatus]);

  if (!order) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-center mb-4">Order Not Found</h2>
          <button
            onClick={onClose}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const getTimeRemaining = () => {
    if (order.status === 'ready') return 0;
    const timeRemaining = Math.max(0, order.estimatedReadyTime - currentTime);
    return Math.ceil(timeRemaining / 60000); // Convert to minutes
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'queued': return 'text-yellow-600';
      case 'cooking': return 'text-orange-600';
      case 'ready': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case 'queued': return <FaClock className="text-yellow-600" />;
      case 'cooking': return <FaFire className="text-orange-600" />;
      case 'ready': return <FaCheckCircle className="text-green-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Tracking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Order ID */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="text-lg font-semibold text-yellow-600">#{orderId}</p>
        </div>

        {/* Status Section */}
        <div className="mb-8">
          <div className={`flex items-center justify-center mb-4 ${getStatusColor()}`}>
            <div className="text-3xl mr-3">{getStatusIcon()}</div>
            <div>
              <p className="text-xl font-semibold capitalize">{order.status}</p>
              {order.status === 'cooking' && (
                <p className="text-sm">Your delicious food is being prepared!</p>
              )}
              {order.status === 'ready' && (
                <p className="text-sm">Your order is ready for pickup!</p>
              )}
            </div>
          </div>

          {/* Time Display */}
          <div className="text-center">
            {order.status !== 'ready' ? (
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {timeRemaining} minutes
                </p>
                <p className="text-sm text-gray-600">Estimated time remaining</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-green-600">Ready!</p>
                <p className="text-sm text-gray-600">Please collect your order</p>
              </div>
            )}
          </div>
        </div>

        {/* Cooking Animation */}
        {order.status === 'cooking' && (
          <div className="mb-8">
            <div className="flex justify-center items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl"
              >
                <FaUtensils className="text-yellow-600" />
              </motion.div>
            </div>
            <div className="mt-4 text-center">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg font-semibold text-orange-600"
              >
                Cooking in progress...
              </motion.div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {order.status === 'ready' ? '100%' : `${Math.max(0, 100 - (timeRemaining / order.waitingTime) * 100).toFixed(0)}%`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ 
                width: order.status === 'ready' ? '100%' : `${Math.max(0, 100 - (timeRemaining / order.waitingTime) * 100)}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Your Order</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-yellow-600">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Order Status</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold">Order Placed</p>
                <p className="text-sm text-gray-600">
                  {order.orderTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                order.status === 'cooking' || order.status === 'ready' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div>
                <p className="font-semibold">Cooking Started</p>
                <p className="text-sm text-gray-600">
                  {order.status === 'cooking' || order.status === 'ready' ? 'In progress' : 'Pending'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                order.status === 'ready' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div>
                <p className="font-semibold">Ready for Pickup</p>
                <p className="text-sm text-gray-600">
                  {order.status === 'ready' ? 'Ready now!' : 'Preparing...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Recent Updates</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {notifications
              .filter(n => n.orderId === orderId)
              .slice(0, 5)
              .map((notification) => (
                <div key={notification.id} className="flex items-start p-2 bg-blue-50 rounded-lg">
                  <FaBell className="text-blue-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm font-semibold">{notification.message}</p>
                    <p className="text-xs text-gray-600">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          {order.status === 'ready' && (
            <button
              onClick={() => {
                // Handle order completion
                onClose();
              }}
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Order Collected
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;