import { Request, Response } from "express";
import { Task } from "../models/Task";

let tasks: Task[] = [];

export const getTasks = (req: Request, res: Response) => {
  res.json(tasks);
};

export const addTask = (req: Request, res: Response) => {
  const newTask: Task = req.body;
  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedTask: Task = req.body;
  tasks = tasks.map((task) => (task.id === id ? updatedTask : task));
  res.json(updatedTask);
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
};
