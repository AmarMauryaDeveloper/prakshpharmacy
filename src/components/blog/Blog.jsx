import React from "react";
// import Back from "../common/back/Back"; // Make sure this path is correct
import BlogCard from "./BlogCard";

const Blog = () => {
  return (
    <>
      <div
        className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/bgimg.jpg')" }}
      >
        {/* Dark Overlay for Better Visibility */}
        <div className="absolute inset-0 flex justify-center items-center">
          <p title="Explore Our Blog" />
        </div>
      </div>

      <section className="blog padding">
        <div className="container grid2">
          <BlogCard />
        </div>
      </section>
    </>
  );
};

export default Blog;
