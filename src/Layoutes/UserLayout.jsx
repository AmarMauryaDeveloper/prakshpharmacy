import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserLayout = ({ children,cart,setData }) => {

  return (
    <div>
      <Navbar cart={cart} setData={setData} />
      <main className="">{children}</main>
      <div className="">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
