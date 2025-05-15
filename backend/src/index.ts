import express from "express";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
