import express from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getUpcomingTasks,
} from "../controllers/taskController";

const router = express.Router();

router.get("/", getTasks);
router.get("/upcoming", getUpcomingTasks);
router.post("/", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
