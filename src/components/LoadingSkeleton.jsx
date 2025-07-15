import { motion } from "framer-motion";

const LoadingSkeleton = ({ count = 6 }) => {
  const skeletonItems = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {skeletonItems.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
        >
          {/* Image skeleton */}
          <div className="relative pt-[75%] bg-gray-200 animate-pulse">
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <div className="bg-gray-300 w-8 h-8 rounded-full animate-pulse"></div>
              <div className="bg-gray-300 w-8 h-8 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-4">
            {/* Title and price skeleton */}
            <div className="flex justify-between items-start mb-2">
              <div className="bg-gray-300 h-6 w-32 rounded animate-pulse"></div>
              <div className="bg-gray-300 h-6 w-16 rounded animate-pulse"></div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div className="bg-gray-300 h-4 w-full rounded animate-pulse"></div>
              <div className="bg-gray-300 h-4 w-3/4 rounded animate-pulse"></div>
            </div>

            {/* Button skeleton */}
            <div className="bg-gray-300 h-10 w-full rounded animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;