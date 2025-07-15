import { useState } from "react";
import { motion } from "framer-motion";
import { useOrderQueue } from "../context/OrderQueueContext";
import { FaClock, FaUsers, FaUtensils, FaCheckCircle } from "react-icons/fa";

const QueueDemo = () => {
  const { orderQueue, activeOrders, getAllFoodPrepTimes } = useOrderQueue();
  const [selectedFood, setSelectedFood] = useState("4"); // Default to Dosa
  const [demoQuantity, setDemoQuantity] = useState(1);
  const foodPrepTimes = getAllFoodPrepTimes();

  // Calculate demo wait time
  const calculateDemoWaitTime = () => {
    if (!selectedFood || !foodPrepTimes[selectedFood]) return 0;
    
    const food = foodPrepTimes[selectedFood];
    let itemsInQueue = 0;
    
    // Count items in current queue
    orderQueue.forEach(order => {
      order.items.forEach(item => {
        if (item.id === selectedFood) {
          itemsInQueue += item.quantity;
        }
      });
    });
    
    // Calculate batches needed
    const totalItems = itemsInQueue + parseInt(demoQuantity);
    const batchesNeeded = Math.ceil(totalItems / food.batchSize);
    const myBatch = Math.ceil((itemsInQueue + 1) / food.batchSize);
    
    return (myBatch - 1) * food.baseTime;
  };

  const demoWaitTime = calculateDemoWaitTime();
  const selectedFoodData = foodPrepTimes[selectedFood];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaUtensils className="mr-3 text-yellow-500" />
        Queue System Demo
      </h2>
      
      {/* Demo Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Food Item
          </label>
          <select
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {Object.entries(foodPrepTimes).map(([id, food]) => (
              <option key={id} value={id}>
                {food.name} ({food.baseTime}min, batch of {food.batchSize})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={demoQuantity}
            onChange={(e) => setDemoQuantity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Wait Time
          </label>
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <FaClock className="text-yellow-600 mr-2" />
            <span className="text-xl font-bold text-yellow-600">
              {demoWaitTime} min
            </span>
          </div>
        </div>
      </div>

      {/* Selected Food Details */}
      {selectedFoodData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Food Details</h3>
            <p className="text-sm text-blue-700">
              <strong>Name:</strong> {selectedFoodData.name}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Base Time:</strong> {selectedFoodData.baseTime} minutes
            </p>
            <p className="text-sm text-blue-700">
              <strong>Batch Size:</strong> {selectedFoodData.batchSize} items
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Current Queue</h3>
            <p className="text-sm text-green-700">
              <strong>Active Orders:</strong> {activeOrders.length}
            </p>
            <p className="text-sm text-green-700">
              <strong>Items in Queue:</strong> {
                orderQueue.reduce((total, order) => {
                  return total + order.items.reduce((orderTotal, item) => {
                    return item.id === selectedFood ? orderTotal + item.quantity : orderTotal;
                  }, 0);
                }, 0)
              }
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Calculation</h3>
            <p className="text-sm text-purple-700">
              <strong>Your Position:</strong> {
                Math.ceil((orderQueue.reduce((total, order) => {
                  return total + order.items.reduce((orderTotal, item) => {
                    return item.id === selectedFood ? orderTotal + item.quantity : orderTotal;
                  }, 0);
                }, 0) + 1) / selectedFoodData.batchSize)
              }
            </p>
            <p className="text-sm text-purple-700">
              <strong>Batches Ahead:</strong> {
                Math.ceil((orderQueue.reduce((total, order) => {
                  return total + order.items.reduce((orderTotal, item) => {
                    return item.id === selectedFood ? orderTotal + item.quantity : orderTotal;
                  }, 0);
                }, 0) + 1) / selectedFoodData.batchSize) - 1
              }
            </p>
          </div>
        </div>
      )}

      {/* Queue Visualization */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Queue Visualization</h3>
        <div className="space-y-3">
          {orderQueue.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaCheckCircle className="mx-auto text-4xl mb-2" />
              <p>No orders in queue - Your order would be prepared immediately!</p>
            </div>
          ) : (
            orderQueue.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} items • Status: {order.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-yellow-600">
                    {order.waitingTime} min
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.estimatedReadyTime.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">How the Queue System Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Batch Processing</h4>
            <p className="text-sm text-gray-600">
              Food items are prepared in batches. For example, if a dosa maker can prepare 5 dosas at once, 
              that's one batch taking 5 minutes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Queue Position</h4>
            <p className="text-sm text-gray-600">
              Your wait time depends on how many items are ahead of you in the queue and how they fit into batches.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Real-time Updates</h4>
            <p className="text-sm text-gray-600">
              The system recalculates wait times as orders are placed and completed, giving accurate estimates.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Notifications</h4>
            <p className="text-sm text-gray-600">
              Customers receive timely notifications: when cooking starts, 5 minutes before ready, 2 minutes before, and when ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDemo;