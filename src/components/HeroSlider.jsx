import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch slides data (including images and content) from backend API
    fetch("https://68767541814c0dfa653c2c85.mockapi.io/slider")
      .then((res) => res.json())
      .then((data) => setSlides(data))
      .catch(() => setSlides([]));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentSlide ? 1 : 0,
            x:
              index === currentSlide
                ? 0
                : index > currentSlide
                ? "100%"
                : "-100%",
          }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-white mb-8"
            >
              {slide.description}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#d4af37" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-gray-800 hover:bg-gold-600 text-white px-8 py-3 rounded-md text-lg font-semibold"
            >
              {slide.buttonText}Claim Your Meal
            </motion.button>
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-gold-500" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
