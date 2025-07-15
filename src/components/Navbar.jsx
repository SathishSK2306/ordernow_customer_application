import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaHeart, FaHistory } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ["Home", "Menu", "payment"];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-gray-900 text-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-gold-500"
        >
          <Link to="/" className="hover:text-gold-400 transition-colors">
            OrderNow
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8">
          {navItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-gold-500 transition-colors"
            >
              <Link
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="font-medium"
              >
                {item}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 bg-gray-900 shadow-lg"
          >
            <ul className="flex flex-col space-y-4 p-4">
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white hover:text-gold-500 transition-colors"
                >
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="block py-2 px-4 font-medium"
                    onClick={closeMenu}
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}

              {/* Favorites */}
              <motion.li
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white hover:text-gold-500 transition-colors"
              >
                <Link
                  to="/favorites"
                  className="block py-2 px-4 font-medium flex items-center space-x-2"
                  onClick={closeMenu}
                >
                  <FaHeart className="text-red-500" />
                  <span>Favorites</span>
                </Link>
              </motion.li>

              {/* Recent Orders */}
              <motion.li
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white hover:text-gold-500 transition-colors"
              >
                <Link
                  to="/recent-orders"
                  className="block py-2 px-4 font-medium flex items-center space-x-2"
                  onClick={closeMenu}
                >
                  <FaHistory className="text-blue-500" />
                  <span>Recent Orders</span>
                </Link>
              </motion.li>

              <motion.li
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white hover:text-gold-500 transition-colors"
              >
                <button
                  className="w-full bg-gray-700 hover:bg-gold-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-left"
                  onClick={closeMenu}
                >
                  Login
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}

        {/* Desktop Actions */}
        <div className="hidden md:flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#d4af37" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-700 hover:bg-gold-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Login
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
