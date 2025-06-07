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

router.get("/", ...getTasks);
router.post("/", ...addTask);
router.put("/:id", ...updateTask);
router.delete("/:id", ...deleteTask);
router.get("/upcoming", ...getUpcomingTasks);
router.get("/notifications", ...getCurrentNotifications);

export default router;
