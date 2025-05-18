import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "home", path: "/dashboard" },
    { id: "calendar", label: "Calendar", icon: "calendar", path: "/calendar" },
    {
      id: "notifications",
      label: "Notifications",
      icon: "bell",
      path: "/notifications",
    },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans">
      <Sidebar navItems={navItems} />
      <main className="flex-1 px-10 py-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
