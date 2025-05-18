import express from "express";
import { getUpcomingTasks } from "../controllers/taskController";

const router = express.Router();

router.get("/upcoming", getUpcomingTasks);

export default router;
