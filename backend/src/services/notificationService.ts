import { Task } from "../models/Task";
import { tasks } from "../controllers/taskController";
import { Server } from "socket.io";

let io: Server;

export const setSocketIOInstance = (socketIOInstance: Server) => {
  io = socketIOInstance;
};

export const checkForNotifications = async () => {
  try {
    const now = new Date();
    const tasksNeedingNotification = tasks.filter((task: Task) => {
      return (
        task.notificationTime &&
        task.notificationTime <= now &&
        !task.notificationSent
      );
    });

    tasksNeedingNotification.forEach((task: Task) => {
      sendNotification(task);
      task.notificationSent = true;
    });
  } catch (error) {
    console.error("Error checking for notifications:", error);
  }
};

const sendNotification = (task: Task) => {
  console.log(`Notification: Task "${task.title}" is due soon!`);
  if (io) {
    io.emit("notification", task);
  }
};

export const startNotificationService = () => {
  setInterval(checkForNotifications, 10000);
  console.log("Notification service started");
};
