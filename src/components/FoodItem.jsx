import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { FaHeart, FaRegHeart, FaStickyNote, FaLeaf, FaFire, FaCheck, FaChevronLeft, FaChevronRight, FaTag, FaPercent } from "react-icons/fa";
import PlaceholderImage from "./PlaceholderImage";

const FoodItem = ({ item, index }) => {
  const { addToCart, toggleFavorite, isFavorite, setPersonalNote, getPersonalNote, isInCart } = useCart();
  const [isJumping, setIsJumping] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(getPersonalNote(item.id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Multiple images for each item (fallback to single image if not available)
  const images = item.images || [item.image];
  
  // Calculate discount percentage if item has both originalPrice and price
  const discountPercentage = item.originalPrice && item.price < item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;
  
  // Handle adding item to cart with animation
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();
    
    // Start jumping animation
    setIsJumping(true);
    
    // Add item to cart after a short delay
    setTimeout(() => {
      addToCart(item);
      setIsJumping(false);
    }, 500);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };

  // Handle note toggle
  const handleNoteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNoteInput(!showNoteInput);
  };

  // Handle note save
  const handleNoteSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPersonalNote(item.id, noteText);
    setShowNoteInput(false);
  };

  // Handle note input change
  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  // Handle image navigation
  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex flex-col h-full">
        <Link to={`/food/${item.id}`} className="relative pt-[75%] overflow-hidden group">
          {/* Main Image with Zoom Effect */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <PlaceholderImage
              src={images[currentImageIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Image Navigation (only show if multiple images) */}
          {images.length > 1 && isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronLeft size={14} />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronRight size={14} />
              </motion.button>
              
              {/* Image dots indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md flex items-center gap-1 text-sm font-bold">
              <FaPercent size={10} />
              {discountPercentage}% OFF
            </div>
          )}
          
          {/* Offer badge */}
          {item.isSpecialOffer && (
            <div className="absolute top-2 left-2 bg-gold-500 text-white px-2 py-1 rounded-md flex items-center gap-1 text-sm font-bold">
              <FaTag size={10} />
              SPECIAL
            </div>
          )}
          
          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Favorite button */}
            <motion.button
              onClick={handleFavoriteToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white bg-opacity-90 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
            >
              {isFavorite(item.id) ? (
                <FaHeart className="text-red-500" size={16} />
              ) : (
                <FaRegHeart className="text-gray-600" size={16} />
              )}
            </motion.button>
            
            {/* Personal note button */}
            <motion.button
              onClick={handleNoteToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-white bg-opacity-90 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all ${
                getPersonalNote(item.id) ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <FaStickyNote size={16} />
            </motion.button>
          </div>

          {/* Dietary indicators */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            {item.isVegetarian && (
              <div className="bg-green-500 text-white p-1 rounded-full">
                <FaLeaf size={12} />
              </div>
            )}
            {item.isSpicy && (
              <div className="bg-red-500 text-white p-1 rounded-full">
                <FaFire size={12} />
              </div>
            )}
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-grow">
          <Link to={`/food/${item.id}`} className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
              {item.name}
            </h3>
            <div className="flex flex-col items-end">
              {/* Show original price with strikethrough if there's a discount */}
              {item.originalPrice && item.price < item.originalPrice && (
                <span className="text-gray-500 line-through text-sm">
                  ₹{item.originalPrice}
                </span>
              )}
              <span className="font-bold text-gold-500 whitespace-nowrap">
                ₹{item.price}
              </span>
            </div>
          </Link>
          <Link to={`/food/${item.id}`} className="block">
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
              {item.description}
            </p>
          </Link>

          {/* Personal note input */}
          {showNoteInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <textarea
                value={noteText}
                onChange={handleNoteChange}
                placeholder="Add a personal note..."
                className="w-full text-sm border border-gray-300 rounded-md p-2 resize-none"
                rows="2"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleNoteSave}
                  className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Save Note
                </button>
                <button
                  onClick={handleNoteToggle}
                  className="flex-1 bg-gray-300 text-gray-700 py-1 px-2 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Show existing note if any */}
          {getPersonalNote(item.id) && !showNoteInput && (
            <div className="mb-3 p-2 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">{getPersonalNote(item.id)}</p>
            </div>
          )}

          {/* Add to cart button with jumping animation - direction changed to left */}
          {!isInCart(item.id) ? (
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05, backgroundColor: "#d4af37" }}
              whileTap={{ scale: 0.95 }}
              animate={isJumping ? { 
                y: [0, -20, 0],
                x: [0, -50, -100], // Changed direction to left
                scale: [1, 1.2, 0],
                opacity: [1, 1, 0]
              } : {}}
              transition={isJumping ? { 
                duration: 0.8,
                ease: "easeInOut"
              } : {}}
              className="w-full bg-gray-800 hover:bg-gold-600 text-white py-2 rounded-md font-medium transition-colors"
            >
              Add to Cart
            </motion.button>
          ) : (
            <div className="w-full bg-green-500 text-white py-2 rounded-md font-medium flex items-center justify-center gap-2">
              <FaCheck size={16} />
              <span>Added to Cart</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FoodItem;
