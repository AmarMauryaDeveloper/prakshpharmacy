import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import {
  AiOutlineUpload,
  AiOutlineCheckCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import CustomInput from "../../components/ReusableComponent/CustomInput";

const AdditemForm = ({ closeForm, itemToEdit, fetchItems }) => {
  const [productDetails, setProductDetails] = useState({
    title: itemToEdit?.title || "",
    description: itemToEdit?.description || "",
    shortDescription: itemToEdit?.shortDescription || "", // New short description field
    price: itemToEdit?.price || "",
  });
  const [images, setImages] = useState(itemToEdit?.images || []);
  const [isUploading, setIsUploading] = useState(false);

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({
      ...productDetails,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setImages([...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productDetails.title || !productDetails.price || images.length === 0) {
      alert("Please fill out all fields and upload images.");
      return;
    }

    setIsUploading(true);
    const imageURLs = [];

    try {
      // If editing, update the existing item
      if (itemToEdit) {
        if (images.length > 0) {
          // Upload new images only if new images are added
          for (const image of images) {
            const imageRef = ref(storage, `images/${uuidv4()}-${image.name}`);
            await uploadBytes(imageRef, image);
            const imageURL = await getDownloadURL(imageRef);
            imageURLs.push(imageURL);
          }
        }
        const updatedProductData = {
          ...productDetails,
          images: imageURLs.length > 0 ? imageURLs : itemToEdit.images, // Keep old images if none are uploaded
        };

        const productRef = doc(db, "items", itemToEdit.id);
        await updateDoc(productRef, updatedProductData);
        alert("Product updated successfully!");
      } else {
        // Add new product
        for (const image of images) {
          const imageRef = ref(storage, `images/${uuidv4()}-${image.name}`);
          await uploadBytes(imageRef, image);
          const imageURL = await getDownloadURL(imageRef);
          imageURLs.push(imageURL);
        }

        const productId = uuidv4();
        const productData = {
          ...productDetails,
          images: imageURLs,
          productId,
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, "items"), productData);
        alert("Product added successfully!");
      }

      setProductDetails({
        title: "",
        description: "",
        shortDescription: "",
        price: "",
      });
      setImages([]);
      closeForm();
      fetchItems(); 
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Error submitting form.");
    }

    setIsUploading(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        closeForm();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeForm]);

  const fields = [
    { title: "Title", name: "title", type: "text", placeholder: "Enter product title" },
    { title: "Description", name: "description", type: "text", placeholder: "Enter product description" },
    { title: "Short Description", name: "shortDescription", type: "text", placeholder: "Enter short description" }, // Short Description field
    { title: "Price", name: "price", type: "number", placeholder: "Enter product price" },
  ];

  return (
    <div ref={formRef} className="relative w-full max-w-5xl p-8 mx-auto overflow-auto bg-white rounded-lg shadow-lg">
      <button onClick={() => closeForm()} className="absolute text-2xl text-gray-600 top-4 right-4 hover:text-gray-900">
        <AiOutlineClose />
      </button>

      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        {itemToEdit ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="w-full mb-4">
            <CustomInput
              title={field.title}
              name={field.name}
              type={field.type}
              value={productDetails[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <div className="mb-6">
          <label htmlFor="images" className="block text-lg font-semibold text-gray-700">
            Select Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-center mb-6">
          <button
            type="submit"
            className={`py-2 px-4 rounded-lg text-white font-semibold ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} flex items-center justify-center space-x-2`}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <AiOutlineCheckCircle className="animate-spin" /> <span>Uploading...</span>
              </>
            ) : (
              <>
                <AiOutlineUpload /> <span>{itemToEdit ? "Update Product" : "Add Product"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdditemForm;
