import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import CategorySection from "../components/CategorySection";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSlider />
      <CategorySection />
    </div>
  );
};

export default Home;
