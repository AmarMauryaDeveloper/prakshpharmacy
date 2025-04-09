import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase"; // Import your Firestore config
import { collection, getDocs } from "firebase/firestore";
import MainSlider from "./MainSlider";

const Product = ({ cart, setCart }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const itemsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const addToCart = (id, price, title, description, imgSrc) => {
    const obj = { id, price, title, description, imgSrc };
    setCart([...cart, obj]);

    toast.success("Item added to cart", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-10 h-10 border-4 rounded-full text-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />
      <MainSlider />
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Featured Products
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/product/${product.id}`} className="block relative">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="object-cover w-full h-48 rounded-t-lg"
                />
              </Link>
              <div className="p-4">
                <h5 className="text-lg font-semibold text-gray-800 truncate">
                  {product.title}
                </h5>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {product.shortDescription}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">
                    ₹ {product.price}
                  </span>
                  <button
                    onClick={() =>
                      addToCart(
                        product.id,
                        product.price,
                        product.title,
                        product.description,
                        product.images[0]
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition"
                    title="Add to cart"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Product;
