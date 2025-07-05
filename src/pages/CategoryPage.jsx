import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FoodItem from "../components/FoodItem";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoodItems = () => {
      let items = [];

      if (categoryName === "dosa") {
        items = [
          {
            id: 1,
            name: "Masala Dosa",
            price: 120,
            image: "/src/assets/images/dosa-1.jpeg",
            description: "Crispy dosa with spicy potato filling",
          },
          {
            id: 2,
            name: "Ghee Dosa",
            price: 150,
            image: "/src/assets/images/dosa-2.jpeg",
            description: "Dosa made with pure ghee",
          },
          {
            id: 3,
            name: "Onion Dosa",
            price: 100,
            image: "/src/assets/images/dosa-3.jpeg",
            description: "Dosa topped with fresh onions",
          },
          {
            id: 4,
            name: "Paper Dosa",
            price: 90,
            image: "/src/assets/images/dosa-4.jpeg",
            description: "Extra thin and crispy dosa",
          },
          {
            id: 5,
            name: "Rava Dosa",
            price: 110,
            image: "/src/assets/images/dosa-5.jpeg",
            description: "Dosa made with semolina",
          },
          {
            id: 6,
            name: "Set Dosa",
            price: 130,
            image: "/src/assets/images/dosa-6.jpeg",
            description: "Soft and spongy dosa served in set of 3",
          },
        ];
      } else if (categoryName === "pizza") {
        items = [
          {
            id: 7,
            name: "Margherita",
            price: 299,
            image: "/src/assets/images/pizza_1.jpg",
            description: "Classic pizza with tomato and mozzarella",
          },
          {
            id: 8,
            name: "Pepperoni",
            price: 349,
            image: "/src/assets/images/pizza_2.jpg",
            description: "Pizza with pepperoni and cheese",
          },
          {
            id: 9,
            name: "Veggie",
            price: 329,
            image: "/src/assets/images/pizza_3.jpg",
            description: "Pizza with assorted vegetables",
          },
        ];
      }

      setFoodItems(items);
    };

    fetchFoodItems();
    window.scrollTo(0, 0);
  }, [categoryName]);

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
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold capitalize mb-10 text-gold-500 text-center"
          >
            {categoryName}
          </motion.h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {foodItems.map((item, index) => (
              <FoodItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CategoryPage;
