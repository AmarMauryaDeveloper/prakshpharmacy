// import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";

import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, db, getDocs } from "../../firebase";

const ShowBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));

        console.log(querySnapshot);

        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched blogs:", blogsData);

        setBlogs(blogsData);
      } catch (err) {
        setError("Error fetching blogs: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (blogs.length === 0) {
    return <div>No blogs available</div>;
  }

  return (
    <div className="flex container ">
      <div className="p-6 text-black ">
        <h1 class="text-5xl py-10 font-extrabold text-center text-gray-900 sm:text-6xl md:text-5xl bg-gradient-to-r from-primary via-secondary to-pink-500 text-transparent bg-clip-text">
          Our Blogs
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              // onClick={() => navigate(`blogs/blog/${blog.id}`)}
              onClick={() => navigate(`blogs/blog/${blog.id}`)}
              key={blog.id}
              className="p-4 border rounded-lg cursor-pointer"
            >
              <img src={blog.image} />
              <h2 className="text-xl font-semibold ">{blog.title}</h2>
              <h3 className="text-xl font-semibold ">{blog.subtitle}</h3>
              <p
                className="mt-2 text-gray-400"
                dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 100) }}
              />
              <div className="mt-4">
                <Link
                  to={`blogs/blog/${blog.id}`}
                  className="text-primary hover:text-blue-700"
                >
                  View Blog
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowBlogs;
