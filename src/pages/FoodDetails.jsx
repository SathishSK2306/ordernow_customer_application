import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

const FoodDetails = () => {
  const { foodId } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isJumping, setIsJumping] = useState(false);
  const [foodItem, setFoodItem] = useState(null);

  // Fetch food item details from backend API based on foodId
  useEffect(() => {
    fetch(`https://your-backend-api.com/api/foods/${foodId}`)
      .then((res) => res.json())
      .then((data) => setFoodItem(data))
      .catch(() => setFoodItem(null));
  }, [foodId]);

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle adding to cart with animation
  const handleAddToCart = () => {
    setIsJumping(true);
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) {
        addToCart(foodItem);
      }
      setIsJumping(false);
    }, 500);
  };

  if (!foodItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Navbar />
        <p className="text-gray-600 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-12"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              className="md:w-1/2"
            >
              <img
                src={foodItem.image}
                alt={foodItem.name}
                className="w-full h-auto rounded-xl shadow-xl object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ x: 50 }}
              animate={{ x: 0 }}
              className="md:w-1/2"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {foodItem.name}
              </h1>
              <p className="text-2xl text-gold-500 font-semibold mb-6">
                ₹{foodItem.price}
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {foodItem.description}
              </p>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Ingredients
                </h2>
                <ul className="list-disc pl-5 text-gray-700">
                  {foodItem.ingredients &&
                    foodItem.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart button with jumping animation - direction changed to left */}
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.05, backgroundColor: "#d4af37" }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    isJumping
                      ? {
                          y: [0, -30, 0],
                          x: [0, -50, -100],
                          scale: [1, 1.2, 0],
                          opacity: [1, 1, 0],
                        }
                      : {}
                  }
                  transition={
                    isJumping
                      ? {
                          duration: 0.8,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                  className="bg-gray-800 hover:bg-gold-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Add to Cart
                </motion.button>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-gray-700">
                  <span className="font-semibold">Calories:</span>{" "}
                  {foodItem.calories} kcal
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default FoodDetails;
