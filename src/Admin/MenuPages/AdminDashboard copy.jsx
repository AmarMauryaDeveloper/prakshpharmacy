import React, { useEffect, useState } from 'react';
import { db, collection, getDocs } from '../../firebase'; // Adjust the import if necessary
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineAppstoreAdd } from 'react-icons/ai';

const AdminDashboard = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);

  // Fetch counts from Firebase
  const fetchDashboardData = async () => {
    try {
      // Get the number of orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      setOrdersCount(ordersSnapshot.size); // .size gives the number of documents

      // Get the number of users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUsersCount(usersSnapshot.size);

      // Get the number of items
      const itemsSnapshot = await getDocs(collection(db, 'items'));
      setItemsCount(itemsSnapshot.size);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <h1 className="mb-6 text-4xl font-bold text-center text-blue-600">Admin Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Orders */}
        <div className="flex items-center justify-between p-6 transition duration-300 bg-white rounded-lg shadow-lg hover:shadow-2xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Orders</h2>
            <p className="text-3xl font-bold text-blue-600">{ordersCount}</p>
          </div>
          <div className="p-3 text-blue-600 bg-blue-100 rounded-full">
            <AiOutlineShoppingCart size={40} />
          </div>
        </div>

        {/* Total Users */}
        <div className="flex items-center justify-between p-6 transition duration-300 bg-white rounded-lg shadow-lg hover:shadow-2xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Users</h2>
            <p className="text-3xl font-bold text-green-600">{usersCount}</p>
          </div>
          <div className="p-3 text-green-600 bg-green-100 rounded-full">
            <AiOutlineUser size={40} />
          </div>
        </div>

        {/* Total Items */}
        <div className="flex items-center justify-between p-6 transition duration-300 bg-white rounded-lg shadow-lg hover:shadow-2xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Items</h2>
            <p className="text-3xl font-bold text-purple-600">{itemsCount}</p>
          </div>
          <div className="p-3 text-purple-600 bg-purple-100 rounded-full">
            <AiOutlineAppstoreAdd size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
