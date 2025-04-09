import React, { useState, useEffect } from "react";
import { auth, db, collection, query, where, getDocs } from "../firebase";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const ordersArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setOrders(ordersArray);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrackOrder = (trackingNumber) => {
    alert(`Tracking Order: ${trackingNumber}`);
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">My Orders</h2>

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 transition duration-300 transform bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-800">Order ID: {order.id}</h3>
              <p className="mb-4 text-sm text-gray-500">Status: {order.status}</p>

              {order.trackingNumber && (
                <div className="mt-4">
                  <button
                    onClick={() => handleTrackOrder(order.trackingNumber)}
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Track Order
                  </button>
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800">Shipping Address</h4>
                <p className="text-gray-600">{order.selectedAddress.name}</p>
                <p className="text-gray-600">{order.selectedAddress.street}</p>
                <p className="text-gray-600">
                  {order.selectedAddress.city}, {order.selectedAddress.state} {order.selectedAddress.postalCode}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800">Order Items</h4>
                <ul className="space-y-2">
                  {order.cart.map((item, index) => (
                    <li key={index} className="flex justify-between text-gray-600">
                      <span>{item.title}</span>
                      <span>₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-500">You haven't placed any orders yet.</p>
      )}
    </div>
  );
};

export default MyOrdersPage;
