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
