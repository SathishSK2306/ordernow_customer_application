import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import FoodDetails from "./pages/FoodDetails";
import BackToTop from "./components/BackToTop";

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <div className="min-h-screen bg-gray-50 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/food/:foodId" element={<FoodDetails />} />
          </Routes>
          <BackToTop />
        </div>
      </AnimatePresence>
    </Router>
  );
}

export default App;
