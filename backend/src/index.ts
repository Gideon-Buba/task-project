import express from "express";
import taskRoutes from "./routes/taskRoutes";
import { startNotificationService } from "./services/notificationService";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/tasks", taskRoutes);

startNotificationService();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
