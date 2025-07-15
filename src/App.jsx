import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import FoodDetails from "./pages/FoodDetails";
import AdminPanel from "./pages/AdminPanel";
import Favorites from "./pages/Favorites";
import RecentOrders from "./pages/RecentOrders";
import BackToTop from "./components/BackToTop";
import FloatingCart from "./components/FloatingCart";
import JumpToCartAnimation from "./components/JumpToCartAnimation";
import NotificationCenter from "./components/NotificationCenter";
import { CartProvider, useCart } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { OrderQueueProvider } from "./context/OrderQueueContext";

// Wrapper component to use the cart context
const AppContent = () => {
  const { getCartCount } = useCart();

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-gray-50 font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/food/:foodId" element={<FoodDetails />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recent-orders" element={<RecentOrders />} />
        </Routes>
        <FloatingCart itemCount={getCartCount()} />
        <JumpToCartAnimation />
        <NotificationCenter />
        <BackToTop />
      </div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <OrderQueueProvider>
            <AppContent />
          </OrderQueueProvider>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
