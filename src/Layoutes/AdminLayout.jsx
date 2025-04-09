import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div >
      <main className="">{children}</main>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
