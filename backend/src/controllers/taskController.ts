import { Request, Response } from "express";
import { Task } from "../models/Task";
import { v4 as uuidv4 } from "uuid";

export let tasks: Task[] = [];

// Helper function to combine date and time into a Date object
const combineDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

// Helper function to calculate notification time (1 hour before due time)
const calculateNotificationTime = (dueDateTime: Date): Date => {
  const notificationTime = new Date(dueDateTime);
  notificationTime.setHours(notificationTime.getHours() - 1);
  return notificationTime;
};

export const getTasks = (req: Request, res: Response) => {
  const tasksToReturn = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    priority: task.priority,
    status: task.status,
  }));

  console.log(tasksToReturn);
  res.json(tasksToReturn);
};

export const addTask = (req: Request, res: Response) => {
  const taskData: Omit<
    Task,
    "id" | "dueDateTime" | "notificationTime" | "createdAt"
  > = req.body;

  // Combine date and time
  const dueDateTime = combineDateTime(taskData.dueDate, taskData.dueTime);

  // Calculate notification time (1 hour before due time)
  const notificationTime = calculateNotificationTime(dueDateTime);

  const newTask: Task = {
    ...taskData,
    id: uuidv4(),
    dueDateTime,
    notificationTime,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const taskData: Omit<Task, "id" | "dueDateTime" | "notificationTime"> =
    req.body;

  // Combine date and time
  const dueDateTime = combineDateTime(taskData.dueDate, taskData.dueTime);

  // Calculate notification time (1 hour before due time)
  const notificationTime = calculateNotificationTime(dueDateTime);

  const updatedTask: Task = {
    ...taskData,
    id,
    dueDateTime,
    notificationTime,
  };

  tasks = tasks.map((task) => (task.id === id ? updatedTask : task));
  res.json(updatedTask);
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
};

// Add a new controller to get upcoming tasks with notifications
export const getUpcomingTasks = (req: Request, res: Response) => {
  const now = new Date();
  const upcomingTasks = tasks.filter((task) => {
    // Check if task has a notification time and it's in the future
    return task.notificationTime && task.notificationTime > now;
  });

  // Sort by notification time (earliest first)
  upcomingTasks.sort(
    (a, b) => a.notificationTime!.getTime() - b.notificationTime!.getTime()
  );

  res.json(upcomingTasks);
};
