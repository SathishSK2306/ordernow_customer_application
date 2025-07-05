import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FoodItem = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col h-full"
    >
      <Link to={`/food/${item.id}`} className="flex flex-col h-full">
        <div className="relative pt-[75%] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
              {item.name}
            </h3>
            <span className="font-bold text-gold-500 whitespace-nowrap">
              ₹{item.price}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {item.description}
          </p>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#d4af37" }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gray-800 hover:bg-gold-600 text-white py-2 rounded-md font-medium transition-colors"
          >
            Add to Cart
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default FoodItem;
