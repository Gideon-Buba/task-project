import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUpcomingTasks } from "../api/notificationsApi";
import type { Task } from "../api/types";
import { format, parseISO } from "date-fns";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const tasks = await getUpcomingTasks();
        setNotifications(tasks);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up polling to refresh notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const markAsRead = (taskId: string) => {
    setNotifications(notifications.filter((task) => task.id !== taskId));
  };

  const formatNotificationTime = (dateTime: Date) => {
    return format(parseISO(dateTime.toISOString()), "MMM d, yyyy 'at' h:mm a");
  };

  const priorityColors = {
    High: "bg-red-100 border-l-4 border-red-500",
    Medium: "bg-yellow-100 border-l-4 border-yellow-500",
    Low: "bg-green-100 border-l-4 border-green-500",
  };

  const priorityIcons = {
    High: "fas fa-exclamation-circle",
    Medium: "fas fa-exclamation-triangle",
    Low: "fas fa-info-circle",
  };

  const priorityTextColors = {
    High: "text-red-600",
    Medium: "text-yellow-600",
    Low: "text-green-600",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-500"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-bell-slash text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-medium text-gray-600">No notifications</h3>
        <p className="text-gray-500 mt-2">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <button
          onClick={() => setNotifications([])}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <i className="fas fa-check-double mr-1"></i>
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className={`${
                priorityColors[notification.priority]
              } p-4 rounded-lg shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <i
                      className={`${priorityIcons[notification.priority]} ${
                        priorityTextColors[notification.priority]
                      }`}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <i className="fas fa-clock text-gray-400 mr-2"></i>
                      <span className="text-xs text-gray-500">
                        Due {formatNotificationTime(notification.dueDateTime)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                  title="Mark as read"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
