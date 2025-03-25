import React from "react";

const HomePage = () => {
  return (
    <div className=" min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Blog Section */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <img
              src="https://via.placeholder.com/800x400"
              alt="Blog"
              className="w-full rounded-lg"
            />
            <p className="text-gray-500 mt-4">📅 March 15, 2024 • Technology</p>
            <h2 className="text-2xl font-bold mt-2">
              The Future of Web Development: Trends to Watch in 2024
            </h2>
            <p className="text-gray-600 mt-2">
              Explore the latest trends shaping the future of web development,
              from AI-powered tools to revolutionary frameworks.
            </p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded">
              Read More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Blog Post 1 */}
            <div className="bg-white p-4 rounded-lg shadow">
              <img
                src="https://via.placeholder.com/400x200"
                alt="Blog"
                className="w-full rounded-lg"
              />
              <p className="text-gray-500 mt-2">📅 March 14, 2024</p>
              <h3 className="text-lg font-bold">
                Clean Code Principles Every Developer Should Know
              </h3>
              <p className="text-gray-600">
                Learn the essential principles of writing clean, maintainable
                code.
              </p>
              <button className="mt-2 bg-black text-white px-4 py-2 rounded">
                Read More
              </button>
            </div>
            {/* Blog Post 2 */}
            <div className="bg-white p-4 rounded-lg shadow">
              <img
                src="https://via.placeholder.com/400x200"
                alt="Blog"
                className="w-full rounded-lg"
              />
              <p className="text-gray-500 mt-2">📅 March 13, 2024</p>
              <h3 className="text-lg font-bold">
                Building Effective Development Teams
              </h3>
              <p className="text-gray-600">
                Discover strategies for managing high-performing development
                teams.
              </p>
              <button className="mt-2 bg-black text-white px-4 py-2 rounded">
                Read More
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-white p-4 rounded-lg shadow">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Categories */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold">Categories</h3>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li>📂 Technology (12)</li>
              <li>📂 Development (8)</li>
              <li>📂 Design (6)</li>
              <li>📂 Career (4)</li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold">Newsletter</h3>
            <p className="text-gray-600">
              Subscribe to our newsletter for updates.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-2 border rounded mt-2"
            />
            <button className="mt-2 bg-black text-white px-4 py-2 w-full rounded">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
