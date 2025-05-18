import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Calendar from "./pages/CalendarPage";
import Notifications from "./pages/NotificationsPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="notifications" element={<Notifications />} />
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
