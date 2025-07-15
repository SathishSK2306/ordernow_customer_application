// Utility functions for handling images and creating placeholders

export const generatePlaceholderUrl = (text, width = 400, height = 300, backgroundColor = '4ECDC4') => {
  return `https://via.placeholder.com/${width}x${height}/${backgroundColor}/ffffff?text=${encodeURIComponent(text)}`;
};

export const getFoodImageUrl = (foodName, index = 0) => {
  // Create consistent placeholder images for food items
  const colors = [
    'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7',
    'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9'
  ];
  
  const colorIndex = (foodName.length + index) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  return generatePlaceholderUrl(foodName, 400, 300, backgroundColor);
};

export const getFoodImages = (foodName, count = 3) => {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(getFoodImageUrl(foodName, i));
  }
  return images;
};

// Real food images URLs (you can replace these with actual food images)
export const realFoodImages = {
  dosa: [
    'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop'
  ],
  pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  ],
  burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop'
  ],
  biryani: [
    'https://images.unsplash.com/photo-1563379091339-03246963d388?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop'
  ],
  cake: [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop'
  ],
  coffee: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop'
  ]
};

export const getImageForFood = (foodName, category = null) => {
  const name = foodName.toLowerCase();
  const cat = category?.toLowerCase();
  
  // Try to match with real images first
  for (const [key, images] of Object.entries(realFoodImages)) {
    if (name.includes(key) || cat === key) {
      return images;
    }
  }
  
  // Fallback to placeholder images
  return getFoodImages(foodName);
};