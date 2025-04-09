import React, { useState, useEffect } from "react";
import { db, collection, getDocs, doc, deleteDoc } from "../../firebase";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import AdditemForm from "./AdditemForm";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AllItemsPage = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState(null);

  const fetchItems = async () => {
    try {
      const itemsCollection = collection(db, "items");
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsList);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await deleteDoc(itemRef);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setItemToEdit(null);
  };

  const handleToggleDescription = (itemId) => {
    setExpandedDescription((prevId) => (prevId === itemId ? null : itemId));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">All Items</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center p-3 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
        >
          <AiOutlinePlus size={24} />
          <span className="ml-2 hidden md:block">Add Item</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="w-full h-56 mb-4">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                className="rounded-md overflow-hidden"
              >
                {(item.images ?? []).map((imgSrc, index) => (
                  <div key={index}>
                    <img
                      src={imgSrc || "https://via.placeholder.com/300"}
                      alt={item.title}
                      className="object-cover w-full h-56"
                      loading="lazy"
                    />
                  </div>
                ))}
              </Slider>
            </div>

            <h3 className="mb-2 text-lg font-bold text-gray-800">
              {item.title}
            </h3>
            <p
              className={`text-sm text-gray-600 transition-all duration-300 cursor-pointer ${
                expandedDescription === item.id
                  ? "line-clamp-none"
                  : "line-clamp-2"
              }`}
              onClick={() => handleToggleDescription(item.id)}
              title="Click to expand or collapse description"
            >
              {item.shortDescription}
              <span className="ml-1 text-blue-500">
                {expandedDescription === item.id ? "Show Less" : "...More"}
              </span>
            </p>

            {expandedDescription === item.id && (
              <p className="mt-2 text-gray-700">{item.description}</p>
            )}

            <p className="mt-4 text-lg font-semibold text-gray-900">
              ₹{item.price}
            </p>

            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 bg-gray-100 text-blue-500 rounded-full shadow hover:bg-gray-200"
                title="Edit Item"
              >
                <AiOutlineEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-gray-100 text-red-500 rounded-full shadow hover:bg-gray-200"
                title="Delete Item"
              >
                <AiOutlineDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <AdditemForm
              closeForm={handleCloseForm}
              itemToEdit={itemToEdit}
              fetchItems={fetchItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllItemsPage;
