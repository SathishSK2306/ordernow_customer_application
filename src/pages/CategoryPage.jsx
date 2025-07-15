import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FoodItem from "../components/FoodItem";

import SearchAndFilter from "../components/SearchAndFilter";
import LoadingSkeleton from "../components/LoadingSkeleton";

import { getImageForFood } from "../utils/imageUtils";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ priceRange: [0, 500], mealTypes: [] });
  const [sortBy, setSortBy] = useState("name");


  useEffect(() => {
    const fetchFoodItems = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let items = [];

      if (categoryName === "dosa") {
        items = [
          {
            id: 1,
            name: "Masala Dosa",
            price: 120,
            originalPrice: 150,
            images: getImageForFood("Masala Dosa", "dosa"),
            image: getImageForFood("Masala Dosa", "dosa")[0],
            description: "Crispy dosa with spicy potato filling",
            isVegetarian: true,
            isSpicy: true,
            mealType: "breakfast",
            popularity: 95,
            rating: 4.5,
            isSpecialOffer: true,
          },
          {
            id: 2,
            name: "Ghee Dosa",
            price: 150,
            images: getImageForFood("Ghee Dosa", "dosa"),
            image: getImageForFood("Ghee Dosa", "dosa")[0],
            description: "Dosa made with pure ghee",
            isVegetarian: true,
            isSpicy: false,
            mealType: "breakfast",
            popularity: 88,
            rating: 4.3,
          },
          {
            id: 3,
            name: "Onion Dosa",
            price: 100,
            originalPrice: 120,
            images: getImageForFood("Onion Dosa", "dosa"),
            image: getImageForFood("Onion Dosa", "dosa")[0],
            description: "Dosa topped with fresh onions",
            isVegetarian: true,
            isSpicy: false,
            mealType: "breakfast",
            popularity: 82,
            rating: 4.2,
          },
          {
            id: 4,
            name: "Paper Dosa",
            price: 90,
            images: getImageForFood("Paper Dosa", "dosa"),
            image: getImageForFood("Paper Dosa", "dosa")[0],
            description: "Extra thin and crispy dosa",
            isVegetarian: true,
            isSpicy: false,
            mealType: "breakfast",
            popularity: 78,
            rating: 4.1,
          },
          {
            id: 5,
            name: "Rava Dosa",
            price: 110,
            images: getImageForFood("Rava Dosa", "dosa"),
            image: getImageForFood("Rava Dosa", "dosa")[0],
            description: "Dosa made with semolina",
            isVegetarian: true,
            isSpicy: false,
            mealType: "breakfast",
            popularity: 75,
            rating: 4.0,
          },
          {
            id: 6,
            name: "Set Dosa",
            price: 130,
            images: getImageForFood("Set Dosa", "dosa"),
            image: getImageForFood("Set Dosa", "dosa")[0],
            description: "Soft and spongy dosa served in set of 3",
            isVegetarian: true,
            isSpicy: false,
            mealType: "breakfast",
            popularity: 85,
            rating: 4.4,
          },
        ];
      } else if (categoryName === "pizza") {
        items = [
          {
            id: 7,
            name: "Margherita",
            price: 299,
            originalPrice: 350,
            images: getImageForFood("Margherita Pizza", "pizza"),
            image: getImageForFood("Margherita Pizza", "pizza")[0],
            description: "Classic pizza with tomato and mozzarella",
            isVegetarian: true,
            isSpicy: false,
            mealType: "lunch",
            popularity: 92,
            rating: 4.6,
          },
          {
            id: 8,
            name: "Pepperoni",
            price: 349,
            images: getImageForFood("Pepperoni Pizza", "pizza"),
            image: getImageForFood("Pepperoni Pizza", "pizza")[0],
            description: "Pizza with pepperoni and cheese",
            isVegetarian: false,
            isSpicy: true,
            mealType: "lunch",
            popularity: 89,
            rating: 4.5,
            isSpecialOffer: true,
          },
          {
            id: 9,
            name: "Veggie",
            price: 329,
            images: getImageForFood("Veggie Pizza", "pizza"),
            image: getImageForFood("Veggie Pizza", "pizza")[0],
            description: "Pizza with assorted vegetables",
            isVegetarian: true,
            isSpicy: false,
            mealType: "lunch",
            popularity: 85,
            rating: 4.3,
          },
        ];
      }

      setFoodItems(items);
      setFilteredItems(items);
      setSearchResults(items);
      setLoading(false);
    };

    fetchFoodItems();
    window.scrollTo(0, 0);
  }, [categoryName]);

  // Search functionality
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    let searched = foodItems;
    
    if (term.trim()) {
      searched = foodItems.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    setSearchResults(searched);
  }, [foodItems]);

  // Filter functionality
  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Sort functionality
  const handleSort = useCallback((sortOption) => {
    setSortBy(sortOption);
  }, []);

  // Apply all filters and sorting
  useEffect(() => {
    let filtered = searchResults;



    // Apply price range filter
    filtered = filtered.filter(item => 
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
    );

    // Apply meal type filter
    if (filters.mealTypes.length > 0) {
      filtered = filtered.filter(item => 
        filters.mealTypes.includes(item.mealType)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popularity":
          return b.popularity - a.popularity;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredItems(sorted);
  }, [searchResults, filters, sortBy]);

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
            className="text-3xl md:text-4xl font-bold capitalize mb-6 text-gold-500 text-center"
          >
            {categoryName}
          </motion.h1>

          {/* Search and Filter Controls */}
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            itemsCount={filteredItems.length}
          />



          {/* Results info */}
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Showing {filteredItems.length} of {foodItems.length} items
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <FoodItem key={item.id} item={item} index={index} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? 'No items found matching your search.' : 'No items match your filters.'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your {searchTerm ? 'search terms or ' : ''}filters to see more options.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default CategoryPage;
