import axios from "axios";
import type { Task } from "../api/types";

const API_BASE_URL = "http://localhost:3000/api";

// Helper to get the token and set Authorization header
const authHeader = () => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUpcomingTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/tasks/upcoming`,
      authHeader()
    );
    return response.data.map((task: Task) => ({
      ...task,
      dueDateTime: new Date(task.dueDateTime),
      notificationTime: task.notificationTime
        ? new Date(task.notificationTime)
        : undefined,
      createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
    }));
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    throw error;
  }
};

export const getCurrentNotifications = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/tasks/notifications`,
      authHeader()
    );
    return response.data.map((task: Task) => ({
      ...task,
      dueDateTime: new Date(task.dueDateTime),
      notificationTime: task.notificationTime
        ? new Date(task.notificationTime)
        : undefined,
      createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
    }));
  } catch (error) {
    console.error("Error fetching current notifications:", error);
    throw error;
  }
};
