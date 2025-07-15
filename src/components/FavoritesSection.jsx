import { motion } from "framer-motion";
import { FaHeart, FaHistory, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const FavoritesSection = () => {
  const { getFavorites, getRecentOrders, reorderFromHistory, addToCart } = useCart();
  
  const favorites = getFavorites();
  const recentOrders = getRecentOrders(3);

  const handleReorder = (order) => {
    reorderFromHistory(order);
  };

  const handleAddFavoriteToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Favorites Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaHeart className="text-red-500" size={20} />
          <h2 className="text-xl font-bold text-gray-800">Your Favorites</h2>
        </div>
        
        {favorites.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No favorites yet. Start adding items to your favorites!
          </p>
        ) : (
          <div className="space-y-4">
            {favorites.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gold-500 font-medium">₹{item.price}</p>
                </div>
                <motion.button
                  onClick={() => handleAddFavoriteToCart(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gold-500 hover:bg-gold-600 text-white p-2 rounded-full transition-colors"
                >
                  <FaShoppingCart size={14} />
                </motion.button>
              </div>
            ))}
            
            {favorites.length > 3 && (
              <p className="text-gray-500 text-center text-sm">
                +{favorites.length - 3} more favorites
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Recent Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaHistory className="text-blue-500" size={20} />
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
        </div>
        
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No recent orders yet. Place your first order!
          </p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.items.length} items
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold-500">₹{order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{order.orderType}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-sm text-gray-500">+{order.items.length - 3} more</span>
                  )}
                </div>
                
                <motion.button
                  onClick={() => handleReorder(order)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium transition-colors"
                >
                  Quick Reorder
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FavoritesSection;