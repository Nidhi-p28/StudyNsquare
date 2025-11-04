import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Add new task
router.post("/", async (req, res) => {
  console.log("📩 Received new task:", req.body);
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks for logged-in user
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task (mark completed or edit)
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks with deadline exactly on a given date for a user
router.get("/date/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;
    const dayStart = new Date(date);
    dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23,59,59,999);

    const tasks = await Task.find({
      userId,
      deadline: { $gte: dayStart, $lte: dayEnd }
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks by date:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


export default router;
