import React, { useState } from 'react';

const Adminpackage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      alert("Please upload an image");
      setLoading(false);
      return;
    }

    // Here, you can log or process the form data locally
    const productData = {
      title,
      description,
      price,
      imageUrl: URL.createObjectURL(image), // Simulate an image URL for local use
    };

    // Log the data to console (or handle it however you need)
    console.log("Product Data:", productData);

    // Reset form after submission
    setTitle('');
    setDescription('');
    setPrice('');
    setImage(null);
    alert("Product added successfully!");

    setLoading(false);
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-xl font-bold">Admin Page</h1>
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-2 border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
            className="w-full p-2 border border-gray-300"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Adminpackage;
