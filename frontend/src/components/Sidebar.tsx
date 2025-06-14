import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between h-screen">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-blue-600 mb-10 tracking-tight"
        >
          TaskMaster
        </motion.h1>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <div className="w-5 h-5 mr-3">
                  <i className={`fas fa-${item.icon}`}></i>
                </div>
                <span className="text-md font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
      <div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center p-2 rounded-lg transition-all text-gray-600 hover:bg-gray-100 hover:text-red-600 w-full"
        >
          <div className="w-5 h-5 mr-3">
            <i className="fas fa-sign-out-alt"></i>
          </div>
          <span className="text-md font-medium">Logout</span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
