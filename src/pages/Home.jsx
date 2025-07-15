import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import CategorySection from "../components/CategorySection";


import SearchAndFilter from "../components/SearchAndFilter";
import LoadingSkeleton from "../components/LoadingSkeleton";
import FoodItem from "../components/FoodItem";


import { getImageForFood } from "../utils/imageUtils";

const Home = () => {
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ priceRange: [0, 500], mealTypes: [] });
  const [sortBy, setSortBy] = useState("name");
  const [showSearchResults, setShowSearchResults] = useState(false);


  // Sample food items from all categories
  const sampleFoodItems = [
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
      category: "dosa",
    },
    {
      id: 7,
      name: "Margherita Pizza",
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
      category: "pizza",
    },
    {
      id: 20,
      name: "Chicken Burger",
      price: 249,
      originalPrice: 299,
      images: getImageForFood("Chicken Burger", "burger"),
      image: getImageForFood("Chicken Burger", "burger")[0],
      description: "Juicy chicken burger with lettuce and tomato",
      isVegetarian: false,
      isSpicy: false,
      mealType: "lunch",
      popularity: 88,
      rating: 4.4,
      category: "burger",
    },
    {
      id: 30,
      name: "Chicken Biryani",
      price: 399,
      originalPrice: 450,
      images: getImageForFood("Chicken Biryani", "biryani"),
      image: getImageForFood("Chicken Biryani", "biryani")[0],
      description: "Aromatic basmati rice with tender chicken",
      isVegetarian: false,
      isSpicy: true,
      mealType: "lunch",
      popularity: 96,
      rating: 4.7,
      isSpecialOffer: true,
      category: "biryani",
    },
    {
      id: 40,
      name: "Chocolate Cake",
      price: 199,
      images: getImageForFood("Chocolate Cake", "cake"),
      image: getImageForFood("Chocolate Cake", "cake")[0],
      description: "Rich chocolate cake with smooth frosting",
      isVegetarian: true,
      isSpicy: false,
      mealType: "snacks",
      popularity: 85,
      rating: 4.3,
      category: "desserts",
    },
    {
      id: 50,
      name: "Cappuccino",
      price: 149,
      images: getImageForFood("Cappuccino", "coffee"),
      image: getImageForFood("Cappuccino", "coffee")[0],
      description: "Rich espresso with steamed milk foam",
      isVegetarian: true,
      isSpicy: false,
      mealType: "breakfast",
      popularity: 78,
      rating: 4.2,
      category: "beverages",
    },
  ];

  useEffect(() => {
    setAllFoodItems(sampleFoodItems);
    setSearchResults(sampleFoodItems);
    window.scrollTo(0, 0);
  }, []);

  // Search functionality
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setShowSearchResults(term.trim().length > 0);
    
    if (term.trim().length === 0) {
      setSearchResults(allFoodItems);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const searched = allFoodItems.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase()) ||
        item.category.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(searched);
      setLoading(false);
    }, 300);
  }, [allFoodItems]);

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
    if (!showSearchResults) return;
    
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
  }, [searchResults, filters, sortBy, showSearchResults]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSlider />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Global Search */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              What are you craving today?
            </h2>
            <p className="text-gray-600">Search from our entire menu</p>
          </motion.div>
          
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            itemsCount={filteredItems.length}
          />
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Search Results {searchTerm && `for "${searchTerm}"`}
            </h3>
            
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
                      No items found matching your search.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Try adjusting your search terms or filters.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Regular Home Content */}
        {!showSearchResults && (
          <>
            {/* Content can be added here in the future */}
          </>
        )}
      </div>
      
      {/* Categories Section */}
      {!showSearchResults && <CategorySection />}
    </div>
  );
};

export default Home;
