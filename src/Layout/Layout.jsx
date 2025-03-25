import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>
        {children}
        <Outlet />
      </main>
      {/* <FloatingCallAndWhatsappButtons /> */}
      <Footer />
    </>
  );
}
export default Layout;
