import { useState } from "react";
import { motion } from "framer-motion";

const PlaceholderImage = ({ src, alt, className, fallbackSrc }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    // Try fallback image if provided
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setIsLoading(true);
      setHasError(false);
    }
  };

  const generatePlaceholder = () => {
    // Generate a simple colored placeholder based on the food name
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const colorIndex = alt ? alt.length % colors.length : 0;
    const backgroundColor = colors[colorIndex];
    
    return (
      <div 
        className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center`}
        style={{ backgroundColor }}
      >
        <div className="text-center text-white">
          <div className="text-4xl mb-2">🍽️</div>
          <div className="text-sm font-medium px-2">
            {alt || 'Food Item'}
          </div>
        </div>
      </div>
    );
  };

  if (hasError && (!fallbackSrc || imageSrc === fallbackSrc)) {
    return generatePlaceholder();
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} bg-gray-200 animate-pulse absolute inset-0 z-10`}>
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      )}
      <motion.img
        src={imageSrc}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default PlaceholderImage;