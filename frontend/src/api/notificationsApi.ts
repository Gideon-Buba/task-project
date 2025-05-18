import axios from "axios";
import type { Task } from "../api/types";

const API_BASE_URL = "http://localhost:3000/api/notifications";

export const getUpcomingTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/upcoming`);
    return response.data.map((task: any) => ({
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
