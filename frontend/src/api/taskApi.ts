import axios from "axios";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  dueDateTime: Date;
  priority: "High" | "Medium" | "Low";
  status: boolean;
  notificationTime?: Date;
  notificationSent?: boolean;
  createdAt?: Date;
}

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

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`, authHeader());
    return response.data.map((task: Task) => ({
      ...task,
      dueDateTime: new Date(`${task.dueDate}T${task.dueTime}:00`),
      notificationTime: task.notificationTime
        ? new Date(task.notificationTime)
        : undefined,
      createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addTask = async (
  task: Omit<
    Task,
    "id" | "status" | "dueDateTime" | "notificationTime" | "createdAt"
  >
): Promise<Task> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tasks`,
      { ...task, status: false },
      authHeader()
    );
    return {
      ...response.data,
      dueDateTime: new Date(response.data.dueDateTime),
      notificationTime: response.data.notificationTime
        ? new Date(response.data.notificationTime)
        : undefined,
      createdAt: response.data.createdAt
        ? new Date(response.data.createdAt)
        : undefined,
    };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (
  id: string,
  updatedTask: Partial<Task>
): Promise<Task> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/tasks/${id}`,
      updatedTask,
      authHeader()
    );
    return {
      ...response.data,
      dueDateTime: new Date(response.data.dueDateTime),
      notificationTime: response.data.notificationTime
        ? new Date(response.data.notificationTime)
        : undefined,
      createdAt: response.data.createdAt
        ? new Date(response.data.createdAt)
        : undefined,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<string> => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${id}`, authHeader());
    return id;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
