import { createContext, useState, useContext, useEffect } from "react";

const OrderQueueContext = createContext();

export const useOrderQueue = () => useContext(OrderQueueContext);

export const OrderQueueProvider = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderQueue, setOrderQueue] = useState([]);
  const [foodPrepTimes, setFoodPrepTimes] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [currentOrderStatus, setCurrentOrderStatus] = useState(null);

  // Default food preparation times (in minutes)
  const defaultFoodPrepTimes = {
    1: { name: "Margherita Pizza", baseTime: 15, batchSize: 2 },
    2: { name: "Chicken Burger", baseTime: 10, batchSize: 4 },
    3: { name: "Vegetable Fried Rice", baseTime: 12, batchSize: 3 },
    4: { name: "Masala Dosa", baseTime: 5, batchSize: 5 },
    5: { name: "Chicken Biryani", baseTime: 25, batchSize: 2 },
    6: { name: "Paneer Tikka", baseTime: 20, batchSize: 3 },
    7: { name: "Fish Curry", baseTime: 18, batchSize: 2 },
    8: { name: "Veg Thali", baseTime: 15, batchSize: 4 },
    9: { name: "Chicken Tikka", baseTime: 22, batchSize: 3 },
    10: { name: "Mutton Curry", baseTime: 35, batchSize: 2 },
    11: { name: "Prawn Fry", baseTime: 15, batchSize: 3 },
    12: { name: "Veg Biryani", baseTime: 20, batchSize: 3 },
    13: { name: "Chicken Curry", baseTime: 25, batchSize: 2 },
    14: { name: "Fish Fry", baseTime: 12, batchSize: 4 },
    15: { name: "Mutton Biryani", baseTime: 40, batchSize: 2 },
    16: { name: "Veg Curry", baseTime: 15, batchSize: 4 },
    17: { name: "Chicken Fried Rice", baseTime: 14, batchSize: 3 },
    18: { name: "Egg Curry", baseTime: 10, batchSize: 4 },
    19: { name: "Dal Tadka", baseTime: 8, batchSize: 6 },
    20: { name: "Roti/Chapati", baseTime: 2, batchSize: 10 },
    21: { name: "Naan", baseTime: 3, batchSize: 8 },
    22: { name: "Samosa", baseTime: 8, batchSize: 6 },
    23: { name: "Idli", baseTime: 4, batchSize: 8 },
    24: { name: "Vada", baseTime: 6, batchSize: 6 },
    25: { name: "Upma", baseTime: 10, batchSize: 4 },
    26: { name: "Poha", baseTime: 8, batchSize: 5 },
    27: { name: "Aloo Paratha", baseTime: 12, batchSize: 4 },
    28: { name: "Chole Bhature", baseTime: 15, batchSize: 3 },
    29: { name: "Pav Bhaji", baseTime: 12, batchSize: 4 },
    30: { name: "Misal Pav", baseTime: 10, batchSize: 4 }
  };

  // Load food prep times from localStorage on mount
  useEffect(() => {
    const savedPrepTimes = localStorage.getItem('ordernow_food_prep_times');
    if (savedPrepTimes) {
      try {
        setFoodPrepTimes(JSON.parse(savedPrepTimes));
      } catch (error) {
        console.error('Error parsing saved prep times:', error);
        setFoodPrepTimes(defaultFoodPrepTimes);
      }
    } else {
      setFoodPrepTimes(defaultFoodPrepTimes);
    }
  }, []);

  // Save food prep times to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ordernow_food_prep_times', JSON.stringify(foodPrepTimes));
  }, [foodPrepTimes]);

  // Calculate waiting time for a new order
  const calculateWaitingTime = (cartItems) => {
    let totalWaitTime = 0;
    const itemsBeforeMe = {};

    // Count items in queue before this order
    orderQueue.forEach(order => {
      order.items.forEach(item => {
        if (!itemsBeforeMe[item.id]) {
          itemsBeforeMe[item.id] = 0;
        }
        itemsBeforeMe[item.id] += item.quantity;
      });
    });

    // Calculate wait time for each item in current order
    cartItems.forEach(item => {
      const prepTime = foodPrepTimes[item.id];
      if (prepTime) {
        const itemsInQueue = itemsBeforeMe[item.id] || 0;
        const batchesNeeded = Math.ceil((itemsInQueue + item.quantity) / prepTime.batchSize);
        const myBatch = Math.ceil((itemsInQueue + 1) / prepTime.batchSize);
        const waitTime = (myBatch - 1) * prepTime.baseTime;
        totalWaitTime = Math.max(totalWaitTime, waitTime);
      }
    });

    return totalWaitTime;
  };

  // Add order to queue
  const addToQueue = (cartItems, customerInfo) => {
    const orderId = Date.now().toString();
    const waitingTime = calculateWaitingTime(cartItems);
    const estimatedReadyTime = new Date(Date.now() + waitingTime * 60000);

    const newOrder = {
      id: orderId,
      items: cartItems,
      customerInfo,
      waitingTime,
      estimatedReadyTime,
      status: 'queued',
      orderTime: new Date(),
      notifications: []
    };

    setOrderQueue(prev => [...prev, newOrder]);
    setActiveOrders(prev => [...prev, newOrder]);
    
    // Start the order tracking
    startOrderTracking(orderId, waitingTime);
    
    return newOrder;
  };

  // Start order tracking with notifications
  const startOrderTracking = (orderId, waitingTime) => {
    const order = activeOrders.find(o => o.id === orderId);
    if (!order) return;

    // Update order status to 'cooking'
    setTimeout(() => {
      updateOrderStatus(orderId, 'cooking');
      addNotification(orderId, 'Your order is being prepared!', 'info');
    }, 1000);

    // 5-minute warning
    if (waitingTime > 5) {
      setTimeout(() => {
        addNotification(orderId, 'Your order will be ready in 5 minutes!', 'warning');
      }, (waitingTime - 5) * 60000);
    }

    // 2-minute warning
    if (waitingTime > 2) {
      setTimeout(() => {
        addNotification(orderId, 'Your order will be ready in 2 minutes!', 'warning');
      }, (waitingTime - 2) * 60000);
    }

    // Order ready notification
    setTimeout(() => {
      updateOrderStatus(orderId, 'ready');
      addNotification(orderId, 'Your order is ready for pickup!', 'success');
    }, waitingTime * 60000);
  };

  // Update order status
  const updateOrderStatus = (orderId, status) => {
    setActiveOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    setOrderQueue(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  // Add notification
  const addNotification = (orderId, message, type) => {
    const notification = {
      id: Date.now(),
      orderId,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 10000);
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  // Get current order status
  const getCurrentOrderStatus = (orderId) => {
    return activeOrders.find(order => order.id === orderId);
  };

  // Update food preparation times (for admin)
  const updateFoodPrepTime = (foodId, baseTime, batchSize) => {
    setFoodPrepTimes(prev => ({
      ...prev,
      [foodId]: {
        ...prev[foodId],
        baseTime: parseInt(baseTime),
        batchSize: parseInt(batchSize)
      }
    }));
  };

  // Get all food preparation times
  const getAllFoodPrepTimes = () => {
    return foodPrepTimes;
  };

  // Complete order (remove from active orders)
  const completeOrder = (orderId) => {
    setActiveOrders(prev => prev.filter(order => order.id !== orderId));
    setOrderQueue(prev => prev.filter(order => order.id !== orderId));
  };

  // Get unread notifications count
  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <OrderQueueContext.Provider
      value={{
        activeOrders,
        orderQueue,
        foodPrepTimes,
        notifications,
        currentOrderStatus,
        addToQueue,
        calculateWaitingTime,
        updateOrderStatus,
        addNotification,
        removeNotification,
        markNotificationAsRead,
        getCurrentOrderStatus,
        updateFoodPrepTime,
        getAllFoodPrepTimes,
        completeOrder,
        getUnreadNotificationsCount,
        defaultFoodPrepTimes
      }}
    >
      {children}
    </OrderQueueContext.Provider>
  );
};

export default OrderQueueContext;