import { Request, Response } from "express";
import { Task } from "../models/Task";
import { v4 as uuidv4 } from "uuid";

export let tasks: Task[] = [];

const combineDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

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
    dueDateTime: task.dueDateTime,
    notificationTime: task.notificationTime,
    notificationSent: task.notificationSent,
    createdAt: task.createdAt,
  }));

  res.json(tasksToReturn);
};

export const addTask = (req: Request, res: Response) => {
  const taskData: Omit<
    Task,
    "id" | "dueDateTime" | "notificationTime" | "notificationSent" | "createdAt"
  > = req.body;

  const dueDateTime = combineDateTime(taskData.dueDate, taskData.dueTime);
  const notificationTime = calculateNotificationTime(dueDateTime);

  const newTask: Task = {
    ...taskData,
    id: uuidv4(),
    dueDateTime,
    notificationTime,
    notificationSent: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const taskData: Omit<
    Task,
    "id" | "dueDateTime" | "notificationTime" | "notificationSent" | "createdAt"
  > = req.body;

  const dueDateTime = combineDateTime(taskData.dueDate, taskData.dueTime);
  const notificationTime = calculateNotificationTime(dueDateTime);

  const updatedTask: Task = {
    ...taskData,
    id,
    dueDateTime,
    notificationTime,
    notificationSent: false,
    createdAt: new Date(),
  };

  tasks = tasks.map((task) => (task.id === id ? updatedTask : task));
  res.json(updatedTask);
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
};

export const getUpcomingTasks = (req: Request, res: Response) => {
  const now = new Date();
  const upcomingTasks = tasks.filter((task) => {
    return task.notificationTime && task.notificationTime > now;
  });

  upcomingTasks.sort(
    (a, b) => a.notificationTime.getTime() - b.notificationTime.getTime()
  );

  res.json(upcomingTasks);
};

export const getCurrentNotifications = (req: Request, res: Response) => {
  const now = new Date();
  const currentNotifications = tasks.filter((task) => {
    return (
      task.notificationTime &&
      task.notificationTime <= now &&
      !task.notificationSent
    );
  });

  res.json(currentNotifications);
};
