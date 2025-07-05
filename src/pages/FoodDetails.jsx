import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const FoodDetails = () => {
  const { foodId } = useParams();

  const foodItem = {
    id: 1,
    name: "Masala Dosa",
    price: 120,
    image: "/src/assets/images/dosa-1.jpeg",
    description:
      "A crispy, rice-batter crepe encases a spicy mix of mashed potato, which is then dipped in coconut chutney, pickles, tomato-and-lentil-based sauces and other condiments.",
    ingredients: [
      "Rice batter",
      "Potatoes",
      "Onions",
      "Green chilies",
      "Mustard seeds",
      "Turmeric",
    ],
    calories: 350,
  };

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
                  {foodItem.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300">
                    -
                  </button>
                  <span className="px-4 py-1">1</span>
                  <button className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300">
                    +
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#d4af37" }}
                  whileTap={{ scale: 0.95 }}
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
