import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { FaHistory, FaShoppingCart } from "react-icons/fa";

const RecentOrders = () => {
  const { getRecentOrders, reorderFromHistory } = useCart();
  const recentOrders = getRecentOrders(10); // Get more recent orders

  const handleReorder = (order) => {
    reorderFromHistory(order);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Recent Orders
        </h1>
        
        <div className="max-w-4xl mx-auto">
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <FaHistory className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-xl">No recent orders yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Your order history will appear here once you place your first order.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {recentOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.items.length} items • {order.orderType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gold-500">
                        ₹{order.total.toFixed(2)}
                      </p>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Delivered
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Items ordered:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <motion.button
                      onClick={() => handleReorder(order)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaShoppingCart />
                      <span>Reorder</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RecentOrders;