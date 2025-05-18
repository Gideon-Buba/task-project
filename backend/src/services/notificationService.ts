import { Task } from "../models/Task";
import { tasks } from "../controllers/taskController"; // Import the tasks array

// This would be called periodically (e.g., every minute) to check for tasks that need notifications
export const checkForNotifications = async () => {
  try {
    const now = new Date();
    const tasksNeedingNotification = tasks.filter((task: Task) => {
      return (
        task.notificationTime &&
        task.notificationTime <= now &&
        !task.notificationSent // You would need to add this field to your Task model
      );
    });

    // Send notifications for these tasks
    tasksNeedingNotification.forEach((task: Task) => {
      sendNotification(task);
      // Mark as notified
      task.notificationSent = true;
    });
  } catch (error) {
    console.error("Error checking for notifications:", error);
  }
};

// In a real app, you would implement this based on your notification system
const sendNotification = (task: Task) => {
  console.log(`Notification: Task "${task.title}" is due soon!`);
  // Here you would implement actual notification logic
  // For example, sending a push notification, email, etc.
};

// Set up an interval to check for notifications periodically
export const startNotificationService = () => {
  // Check every minute
  setInterval(checkForNotifications, 60000);
  console.log("Notification service started");
};
