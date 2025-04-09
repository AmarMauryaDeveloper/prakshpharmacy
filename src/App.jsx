import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import ProductDetail from "./components/ProductDetail";
import SearchItem from "./components/SearchItem";
import Cart from "./components/Cart";
import { items } from "./components/Data";
import UserLayout from "./Layoutes/UserLayout";
import AdminDashboard from "./Admin/dashboard/AdminSideMenu";
import LoginModal from "./pages/LoginPopUp";
import SignUpPopUp from "./pages/SignUpPopUp";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AddBlogs from "./Admin/AddBlogs/Addblogs";
import AllBlogs from "./Admin/AddBlogs/AllBlogs";
import BlogPage from "./Admin/AddBlogs/BlogPage";
import EditBlog from "./Admin/AddBlogs/EditBlog";
import ShowBlogs from "./Admin/AddBlogs/ShowBlogs";
import Blog from "./components/blog/Blog";

const App = () => {
  const [data, setData] = useState([...items]);
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        {/* User routes */}
        <Route element={<UserLayout cart={cart} setData={setData} />}>
          <Route
            path="/"
            element={<Product cart={cart} setCart={setCart} items={data} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail cart={cart} setCart={setCart} />}
          />
          <Route
            path="/search/:term"
            element={<SearchItem cart={cart} setCart={setCart} />}
          />
          <Route
            path="/cart"
            element={<Cart cart={cart} setCart={setCart} />}
          />
          <Route path="/loginmodel" element={<LoginModal />} />
          <Route path="/signupmodel" element={<SignUpPopUp />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/myorderspage" element={<MyOrdersPage />} />
          <Route path="/showblogs" element={<ShowBlogs />} />
          <Route path="/showblogs/blogs/blog/:id" element={<BlogPage />} />{" "}
          {/* 🔧 New Route */}
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/addbllogs" element={<AddBlogs />} />
        <Route path="/all-blogs" element={<AllBlogs />} />
        <Route path="/blogpage" element={<BlogPage />} />
        <Route path="/editblog" element={<EditBlog />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
