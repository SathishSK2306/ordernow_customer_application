import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaSort, 
  FaChevronDown,
  FaClock,
  FaFire,
  FaUtensils,
  FaCoffee,
  FaStar,
  FaRupeeSign
} from "react-icons/fa";

const SearchAndFilter = ({ onSearch, onFilter, onSort, itemsCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const mealTypes = [
    { id: "breakfast", label: "Breakfast", icon: FaCoffee },
    { id: "lunch", label: "Lunch", icon: FaUtensils },
    { id: "dinner", label: "Dinner", icon: FaFire },
    { id: "snacks", label: "Snacks", icon: FaClock },
  ];

  const sortOptions = [
    { value: "name", label: "Name (A-Z)", icon: FaSort },
    { value: "price-low", label: "Price: Low to High", icon: FaRupeeSign },
    { value: "price-high", label: "Price: High to Low", icon: FaRupeeSign },
    { value: "popularity", label: "Popularity", icon: FaStar },
    { value: "rating", label: "Rating", icon: FaStar },
  ];

  // Handle search
  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  // Handle filter changes
  useEffect(() => {
    onFilter({
      priceRange,
      mealTypes: selectedMealTypes,
    });
  }, [priceRange, selectedMealTypes, onFilter]);

  // Handle sort changes
  useEffect(() => {
    onSort(sortBy);
  }, [sortBy, onSort]);

  const handleMealTypeToggle = (mealType) => {
    setSelectedMealTypes(prev => 
      prev.includes(mealType) 
        ? prev.filter(type => type !== mealType)
        : [...prev, mealType]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 500]);
    setSelectedMealTypes([]);
    setSortBy("name");
  };

  const activeFiltersCount = selectedMealTypes.length + (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search food items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            showFilters ? 'bg-gold-500 text-white border-gold-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FaFilter className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
          >
            <FaSort className="h-4 w-4" />
            <span>Sort by: {sortOptions.find(option => option.value === sortBy)?.label}</span>
            <FaChevronDown className={`h-4 w-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
          </button>

          {showSortMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${
                    sortBy === option.value ? 'bg-gold-50 text-gold-600' : 'text-gray-700'
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {itemsCount} items found
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
              </div>
            </div>

            {/* Meal Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Meal Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mealTypes.map((mealType) => (
                  <button
                    key={mealType.id}
                    onClick={() => handleMealTypeToggle(mealType.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      selectedMealTypes.includes(mealType.id)
                        ? 'bg-gold-500 text-white border-gold-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <mealType.icon className="h-4 w-4" />
                    <span className="text-sm">{mealType.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchAndFilter;