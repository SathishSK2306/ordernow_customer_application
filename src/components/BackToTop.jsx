import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.1, backgroundColor: "#d4af37" }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gold-600 text-white p-3 rounded-full shadow-lg z-50 transition-colors"
      aria-label="Back to top"
    >
      <FaArrowUp size={18} />
    </motion.button>
  );
};

export default BackToTop;
