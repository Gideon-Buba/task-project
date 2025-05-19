import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import taskRoutes from "./routes/taskRoutes";
import {
  startNotificationService,
  setSocketIOInstance,
} from "./services/notificationService";

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Set up Socket.IO
setSocketIOInstance(io);

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Start notification service
startNotificationService();

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});
