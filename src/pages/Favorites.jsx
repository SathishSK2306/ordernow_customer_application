import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FavoritesSection from "../components/FavoritesSection";

const Favorites = () => {
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
          Your Favorites
        </h1>
        
        <FavoritesSection />
      </motion.div>
    </div>
  );
};

export default Favorites;