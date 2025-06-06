import express from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getUpcomingTasks,
  getCurrentNotifications,
} from "../controllers/taskController";

const router = express.Router();

// Spread the arrays to pass middleware and handlers individually
router.get("/tasks", ...getTasks);
router.post("/tasks", ...addTask);
router.put("/tasks/:id", ...updateTask);
router.delete("/tasks/:id", ...deleteTask);
router.get("/tasks/upcoming", ...getUpcomingTasks);
router.get("/tasks/notifications", ...getCurrentNotifications);

export default router;
