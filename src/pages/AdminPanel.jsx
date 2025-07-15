import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrderQueue } from "../context/OrderQueueContext";
import ManualGenerator from "../components/ManualGenerator";
import QueueDemo from "../components/QueueDemo";
import { FaArrowLeft, FaClock, FaUsers, FaSave, FaUndo, FaEdit, FaTrash, FaPlus, FaDownload, FaFileAlt } from "react-icons/fa";

const AdminPanel = () => {
  const { 
    getAllFoodPrepTimes, 
    updateFoodPrepTime, 
    activeOrders,
    defaultFoodPrepTimes 
  } = useOrderQueue();
  
  const [foodPrepTimes, setFoodPrepTimes] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [newFoodItem, setNewFoodItem] = useState({
    name: '',
    baseTime: '',
    batchSize: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { downloadManual, downloadPDF } = ManualGenerator();

  useEffect(() => {
    setFoodPrepTimes(getAllFoodPrepTimes());
  }, [getAllFoodPrepTimes]);

  const handleSave = (foodId) => {
    const food = foodPrepTimes[foodId];
    if (food.baseTime && food.batchSize) {
      updateFoodPrepTime(foodId, food.baseTime, food.batchSize);
      setEditingId(null);
    }
  };

  const handleUpdate = (foodId, field, value) => {
    setFoodPrepTimes(prev => ({
      ...prev,
      [foodId]: {
        ...prev[foodId],
        [field]: value
      }
    }));
  };

  const handleAddNewFood = () => {
    if (newFoodItem.name && newFoodItem.baseTime && newFoodItem.batchSize) {
      const newId = Date.now().toString();
      const newFood = {
        name: newFoodItem.name,
        baseTime: parseInt(newFoodItem.baseTime),
        batchSize: parseInt(newFoodItem.batchSize)
      };
      
      setFoodPrepTimes(prev => ({
        ...prev,
        [newId]: newFood
      }));
      
      updateFoodPrepTime(newId, newFood.baseTime, newFood.batchSize);
      
      setNewFoodItem({ name: '', baseTime: '', batchSize: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteFood = (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      setFoodPrepTimes(prev => {
        const newPrepTimes = { ...prev };
        delete newPrepTimes[foodId];
        return newPrepTimes;
      });
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all food preparation times to default values?')) {
      setFoodPrepTimes(defaultFoodPrepTimes);
      Object.keys(defaultFoodPrepTimes).forEach(foodId => {
        const food = defaultFoodPrepTimes[foodId];
        updateFoodPrepTime(foodId, food.baseTime, food.batchSize);
      });
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(foodPrepTimes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'food_prep_times.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };



  const filteredFoodItems = Object.entries(foodPrepTimes).filter(([id, food]) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600">Manage food preparation times and monitor orders</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={downloadManual}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaFileAlt />
              <span>Manual (MD)</span>
            </button>
            <button
              onClick={downloadPDF}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaDownload />
              <span>Manual (HTML)</span>
            </button>
            <button
              onClick={exportData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaDownload />
              <span>Export Data</span>
            </button>
            <button
              onClick={resetToDefaults}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaUndo />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>

        {/* Queue Demo */}
        <QueueDemo />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaClock className="text-yellow-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-800">{activeOrders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaUsers className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Food Items</p>
                <p className="text-2xl font-bold text-gray-800">{Object.keys(foodPrepTimes).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaClock className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Avg Prep Time</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Object.values(foodPrepTimes).reduce((acc, food) => acc + food.baseTime, 0) / Object.keys(foodPrepTimes).length || 0}
                  <span className="text-sm text-gray-600"> min</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Active Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          Status: <span className="capitalize text-yellow-600">{order.status}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Estimated Ready Time</p>
                        <p className="font-semibold">{order.estimatedReadyTime.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm text-gray-600">
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Food Preparation Times Management */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Food Preparation Times</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add New Food Item</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b">
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Add New Food Form */}
          {showAddForm && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Add New Food Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Food Name"
                  value={newFoodItem.name}
                  onChange={(e) => setNewFoodItem({...newFoodItem, name: e.target.value})}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="number"
                  placeholder="Base Time (minutes)"
                  value={newFoodItem.baseTime}
                  onChange={(e) => setNewFoodItem({...newFoodItem, baseTime: e.target.value})}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="number"
                  placeholder="Batch Size"
                  value={newFoodItem.batchSize}
                  onChange={(e) => setNewFoodItem({...newFoodItem, batchSize: e.target.value})}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddNewFood}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Food Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Food Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Time (min)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFoodItems.map(([foodId, food]) => (
                  <tr key={foodId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{food.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === foodId ? (
                        <input
                          type="number"
                          value={food.baseTime}
                          onChange={(e) => handleUpdate(foodId, 'baseTime', parseInt(e.target.value))}
                          className="w-20 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{food.baseTime}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === foodId ? (
                        <input
                          type="number"
                          value={food.batchSize}
                          onChange={(e) => handleUpdate(foodId, 'batchSize', parseInt(e.target.value))}
                          className="w-20 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{food.batchSize}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {editingId === foodId ? (
                          <>
                            <button
                              onClick={() => handleSave(foodId)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingId(foodId)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteFood(foodId)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;