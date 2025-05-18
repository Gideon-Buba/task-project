import express from "express";
import cors from "cors"; // Add this import
import taskRoutes from "./routes/taskRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { startNotificationService } from "./services/notificationService";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

startNotificationService();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
