import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import sessionRoutes from "./routes/SessionRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Base routes
app.get("/", (req, res) => {
  res.send("✅ Smart Study Planner Backend is running!");
});

// Auth routes
app.use("/api/auth", authRoutes);
// Task routes
app.use("/api/tasks", taskRoutes);
// Planner routes
app.use("/api/planner", plannerRoutes);
app.use("/api/sessions", sessionRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));


  app.get("/api/tasks", async (req, res) => {
  try {
    const { date } = req.query;
    const tasks = await Tasks.find({ date }); // date field in your MongoDB Task model
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});