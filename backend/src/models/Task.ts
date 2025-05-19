export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  dueDateTime: Date;
  priority: "High" | "Medium" | "Low";
  status: boolean;
  notificationTime: Date;
  notificationSent: boolean;
  createdAt: Date;
}
