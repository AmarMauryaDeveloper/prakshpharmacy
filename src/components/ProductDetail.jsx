import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = ({ cart, setCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "items", id));
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching product from Firestore: ", error);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-col gap-10 md:flex-row">
          {/* Image Thumbnails */}
          <div className="flex gap-4 md:flex-col md:gap-6 ">
            {product.images.map((src, index) => (
              <div
                key={index}
                className="w-16 h-20 cursor-pointer"
                onMouseEnter={() => setHoveredImage(src)} 
                onMouseLeave={() => setHoveredImage(product.images[0])} 
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover transition-all transform border rounded-md hover:scale-110"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col w-full p-4 border md:w-2/4">
            <img
              src={hoveredImage || product.images[0]} 
              className="object-cover w-full transition-transform duration-300 transform rounded-lg h-96 hover:scale-105"
              alt={product.title}
            />
          </div>

          <div className="flex flex-col justify-center w-full text-center ">
            <h1 className="mb-4 text-3xl font-semibold text-gray-900">{product.title}</h1>
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-green-500">{product.price} ₹</span>
            </div>
            <p className="mt-6 text-lg text-gray-600">{product.description}</p>
            <p className="mt-6 text-lg text-gray-600">{product.shortDescription}</p>
            <button
              onClick={() =>
                addToCart(product.id, product.price, product.title, product.description, product.images[0])
              }
              className="px-8 py-3 text-white transition-all transform bg-green-500 rounded-lg shadow-md btn hover:bg-green-600 hover:scale-105"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
