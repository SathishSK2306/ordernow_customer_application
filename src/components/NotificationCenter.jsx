import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderQueue } from "../context/OrderQueueContext";
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

const NotificationCenter = () => {
  const { 
    notifications, 
    removeNotification, 
    markNotificationAsRead,
    getUnreadNotificationsCount 
  } = useOrderQueue();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open notification center when new notifications arrive
  useEffect(() => {
    if (notifications.length > 0 && !isOpen) {
      const latestNotification = notifications[notifications.length - 1];
      if (!latestNotification.read) {
        setIsOpen(true);
      }
    }
  }, [notifications, isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-500" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'error': return 'border-red-500 bg-red-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const unreadCount = getUnreadNotificationsCount();

  return (
    <>
      {/* Notification Bell Icon - Positioned lower, white, transparent when no notifications */}
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3 rounded-full shadow-lg transition-all duration-300 ${
            unreadCount > 0 
              ? 'bg-white text-gray-800 hover:bg-gray-100' 
              : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
          }`}
        >
          <FaBell className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-32 right-4 z-40 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-yellow-500 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-yellow-600 rounded-full p-1"
              >
                <FaTimes />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FaBell className="mx-auto text-3xl mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`border-l-4 p-3 rounded-r-lg ${getNotificationColor(notification.type)} ${
                        notification.read ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-600">
                              Order #{notification.orderId} • {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="mt-2 text-xs text-blue-500 hover:text-blue-600"
                        >
                          Mark as read
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed top-32 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications
            .filter(n => !n.read)
            .slice(-3) // Show only last 3 unread notifications
            .map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`border-l-4 p-4 rounded-r-lg shadow-lg ${getNotificationColor(notification.type)} min-w-64`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-600">
                        Order #{notification.orderId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationCenter;