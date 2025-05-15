import axios from "axios";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: boolean;
}

const API_BASE_URL = "http://localhost:3000";

export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addTask = async (task: Omit<Task, "id" | "status">) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, {
      ...task,
      status: false,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (id: string, updatedTask: Partial<Task>) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/tasks/${id}`,
      updatedTask
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
