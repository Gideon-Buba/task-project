import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getUpcomingTasks,
  getCurrentNotifications,
} from "../api/notificationsApi";
import type { Task } from "../api/types";
import { format, parseISO } from "date-fns";
import { io, Socket } from "socket.io-client";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const [upcomingTasks, currentNotifications] = await Promise.all([
          getUpcomingTasks(),
          getCurrentNotifications(),
        ]);

        // Combine and deduplicate notifications
        const allNotifications = [...currentNotifications, ...upcomingTasks];
        const uniqueNotifications = allNotifications.reduce((acc, current) => {
          const exists = acc.some((item) => item.id === current.id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, [] as Task[]);

        setNotifications(uniqueNotifications);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up polling to refresh notifications every 10 seconds
    const intervalId = setInterval(fetchNotifications, 10000);

    return () => {
      clearInterval(intervalId);
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (task: Task) => {
      setNotifications((prev) => {
        // Check if notification already exists
        const exists = prev.some((n) => n.id === task.id);
        if (exists) return prev;

        // Add new notification
        return [...prev, task];
      });

      // Play sound for high priority tasks
      if (task.priority === "High") {
        playNotificationSound();
      }

      // Show browser notification if permitted
      showBrowserNotification(task);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  const markAsRead = (taskId: string) => {
    setNotifications(notifications.filter((task) => task.id !== taskId));
  };

  const formatNotificationTime = (dateTime: Date) => {
    return format(parseISO(dateTime.toISOString()), "MMM d, yyyy 'at' h:mm a");
  };

  const playNotificationSound = () => {
    const audio = new Audio("/notification-sound.mp3");
    audio.play().catch((e) => console.error("Error playing sound:", e));
  };

  const showBrowserNotification = (task: Task) => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(`Task Due: ${task.title}`, {
        body: task.description,
        icon: "/notification-icon.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(`Task Due: ${task.title}`, {
            body: task.description,
            icon: "/notification-icon.png",
          });
        }
      });
    }
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
          {notifications.map((notification) => {
            const isDueNow = notification.notificationTime
              ? new Date(notification.notificationTime) <= new Date()
              : false;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className={`${
                  isDueNow
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : priorityColors[notification.priority]
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
                      {isDueNow && (
                        <div className="mt-2 flex items-center">
                          <i className="fas fa-bell text-blue-500 mr-2"></i>
                          <span className="text-xs font-medium text-blue-700">
                            This task is due now!
                          </span>
                        </div>
                      )}
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
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
