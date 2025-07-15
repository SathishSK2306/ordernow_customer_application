import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FoodItem from "../components/FoodItem";
import SearchAndFilter from "../components/SearchAndFilter";
import LoadingSkeleton from "../components/LoadingSkeleton";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    mealTypes: [],
  });
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchFoodItems = async () => {
      setLoading(true);
      try {
        // Fetch food items for the selected category from backend API
        const res = await fetch(
          `https://your-backend-api.com/api/categories/${categoryName}/foods`
        );
        const items = await res.json();
        setFoodItems(items);
        setFilteredItems(items);
        setSearchResults(items);
      } catch (error) {
        setFoodItems([]);
        setFilteredItems([]);
        setSearchResults([]);
      }
      setLoading(false);
    };

    fetchFoodItems();
    window.scrollTo(0, 0);
  }, [categoryName]);

  // Search functionality
  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      let searched = foodItems;

      if (term.trim()) {
        searched = foodItems.filter(
          (item) =>
            item.name.toLowerCase().includes(term.toLowerCase()) ||
            item.description.toLowerCase().includes(term.toLowerCase())
        );
      }

      setSearchResults(searched);
    },
    [foodItems]
  );

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
    filtered = filtered.filter(
      (item) =>
        item.price >= filters.priceRange[0] &&
        item.price <= filters.priceRange[1]
    );

    // Apply meal type filter
    if (filters.mealTypes.length > 0) {
      filtered = filtered.filter((item) =>
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
                    {searchTerm
                      ? "No items found matching your search."
                      : "No items match your filters."}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your {searchTerm ? "search terms or " : ""}
                    filters to see more options.
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
