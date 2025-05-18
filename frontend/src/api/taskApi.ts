import axios from "axios";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // Date string in YYYY-MM-DD format
  dueTime: string; // Time string in HH:mm format
  dueDateTime: Date; // Full datetime
  priority: "High" | "Medium" | "Low";
  status: boolean;
  notificationTime?: Date; // Optional notification time
  notificationSent?: boolean; // Track if notification was sent
  createdAt?: Date; // Optional creation timestamp
}

const API_BASE_URL = "http://localhost:3000";

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    // Transform the response data to ensure proper Date objects
    return response.data.map((task: any) => {
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}:00`);
      return {
        ...task,
        dueDateTime,
        notificationTime: task.notificationTime
          ? new Date(task.notificationTime)
          : undefined,
        createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
      };
    });
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
    const response = await axios.post(`${API_BASE_URL}/tasks`, {
      ...task,
      status: false,
    });
    // Transform the response data
    return {
      ...response.data,
      dueDateTime: new Date(response.data.dueDateTime),
      notificationTime: new Date(response.data.notificationTime),
      createdAt: new Date(response.data.createdAt),
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
      updatedTask
    );
    // Transform the response data
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
    await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
