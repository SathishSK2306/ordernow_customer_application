import React from 'react';
import { motion } from 'framer-motion';

const TestPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Changes Applied Successfully!</h1>
        <ul className="text-gray-700 space-y-2">
          <li>• Notification bell moved lower</li>
          <li>• Bell is white and transparent</li>
          <li>• Favorites & Recent Orders in hamburger menu</li>
          <li>• Dietary filters removed</li>
          <li>• Test order system removed</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default TestPage;