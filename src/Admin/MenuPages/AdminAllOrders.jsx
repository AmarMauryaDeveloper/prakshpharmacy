import React, { useEffect, useState } from "react";
import { db, collection, doc, updateDoc, onSnapshot } from "../../firebase"; // Using onSnapshot for real-time updates

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(ordersRef, (querySnapshot) => {
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Orders:", fetchedOrders);

      const filteredOrders = fetchedOrders.filter(
        (order) => order.status.toLowerCase() === activeTab.toLowerCase()
      );

      setOrders(filteredOrders);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    // Confirm action before updating
    const isConfirmed = window.confirm(`Are you sure you want to mark this order as ${newStatus}?`);
    if (!isConfirmed) return;

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">Admin Orders</h2>

      {/* Tab Bar */}
      <div className="flex mb-6 space-x-4 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab("live")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg ${
            activeTab === "live" ? "bg-blue-500 text-white" : "text-blue-500"
          } transition-all`}
        >
          Live Orders
        </button>
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg ${
            activeTab === "ongoing" ? "bg-yellow-500 text-white" : "text-yellow-500"
          } transition-all`}
        >
          Ongoing Orders
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 text-lg font-semibold rounded-lg ${
            activeTab === "completed" ? "bg-green-500 text-white" : "text-green-500"
          } transition-all`}
        >
          Completed Orders
        </button>
      </div>

      {/* Display Orders */}
      {orders.length > 0 ? (
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 mb-6 transition-all bg-white shadow-lg rounded-xl hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-800">Order ID: {order.id}</h3>
              <p className="text-sm text-gray-600">
                Status: <span className="font-semibold text-gray-900">{order.status}</span>
              </p>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Shipping Address</h4>
                <p>{order.selectedAddress.name}</p>
                <p>{order.selectedAddress.street}</p>
                <p>
                  {order.selectedAddress.city}, {order.selectedAddress.state}{" "}
                  {order.selectedAddress.postalCode}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Order Items</h4>
                <ul className="space-y-2">
                  {order.cart.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {item.title} - <span className="font-semibold">₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Change Order Status */}
              <div className="flex mt-6 space-x-4">
                {activeTab === "live" && (
                  <button
                    onClick={() => handleStatusChange(order.id, "ongoing")}
                    className="px-4 py-2 text-white transition-all bg-yellow-500 rounded-lg hover:bg-yellow-600"
                  >
                    Mark as Ongoing
                  </button>
                )}
                {activeTab === "ongoing" && (
                  <button
                    onClick={() => handleStatusChange(order.id, "completed")}
                    className="px-4 py-2 text-white transition-all bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                )}
                {activeTab === "completed" && (
                  <p className="text-gray-500">Order completed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders found</p>
      )}
    </div>
  );
};

export default AdminAllOrders;
