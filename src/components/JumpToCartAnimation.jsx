import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const JumpToCartAnimation = () => {
  const { lastAddedItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (lastAddedItem) {
      setIsVisible(true);
      
      // Hide the animation after it completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem]);
  
  if (!lastAddedItem) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-[100] pointer-events-none"
          initial={{ 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)",
            opacity: 1,
            scale: 1
          }}
          animate={{ 
            top: "calc(100% - 80px)",
            left: "80px", // Changed to target the left corner
            scale: 0.2,
            opacity: 0
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut" 
          }}
        >
          <div className="bg-gold-500 text-white rounded-full p-2 shadow-lg">
            <div className="w-10 h-10 flex items-center justify-center font-bold">
              {lastAddedItem.name.charAt(0)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JumpToCartAnimation;