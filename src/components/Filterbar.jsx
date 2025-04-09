import React from "react";
import { items } from "./Data"; // Assuming the items data is coming from Data.js

const FilterSidebar = ({ setData }) => {
  const categories = ["mobiles", "laptops", "tablets"];
  const priceFilters = [29999, 49999, 69999, 89999];

  const filterByCategory = (category) => {
    const filteredItems = items.filter((product) => product.category === category);
    setData(filteredItems);
  };

  const filterByPrice = (price) => {
    const filteredItems = items.filter((product) => product.price >= price);
    setData(filteredItems);
  };

  return (
    <div className="flex flex-col p-4 space-y-4 rounded-lg shadow-lg sm:flex-row sm:w-full sm:space-y-0 sm:space-x-6 bg-primary">
      {/* Title */}
      <div className="mb-4 text-xl font-semibold text-white sm:mb-0 sm:w-full">
        Filter by
      </div>

      {/* No Filter Option */}
      <div 
        onClick={() => setData(items)} 
        className="p-2 text-gray-700 transition duration-200 rounded-md cursor-pointer hover:text-blue-600 sm:w-1/4"
      >
        No Filter
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap space-x-4 space-y-2 sm:w-3/4 sm:space-y-0">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => filterByCategory(category)}
            className="p-2 text-gray-700 transition duration-200 rounded-md cursor-pointer hover:text-blue-600 sm:w-1/3"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>

      {/* Price Filters */}
      <div className="flex flex-wrap space-x-4 space-y-2 sm:w-3/4 sm:space-y-0">
        {priceFilters.map((price) => (
          <div
            key={price}
            onClick={() => filterByPrice(price)}
            className="p-2 text-gray-700 transition duration-200 rounded-md cursor-pointer hover:text-blue-600 sm:w-1/3"
          >
            {">="} {price}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
