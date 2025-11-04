// backend/routes/plannerRoutes.js
import express from "express";
import Planner from "../models/plannerModel.js";

const router = express.Router();

/* ======================================================
   ➕ CREATE PLANNER ENTRY
   ====================================================== */
router.post("/", async (req, res) => {
  try {
    let {
      userId,
      subject,
      targetHours,
      priority,
      dailyGoal,
      startDate,
      endDate,
      date,
      notes,
    } = req.body;

    if (!userId) {
      console.error("❌ Missing userId in planner request");
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Handle date fields gracefully
    if (!date && !startDate && !endDate) {
      // if no date or range is given, set today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date = today;
    } else {
      if (date) date = new Date(date);
      if (startDate) startDate = new Date(startDate);
      if (endDate) endDate = new Date(endDate);
    }

    const planner = new Planner({
      userId,
      subject,
      targetHours,
      priority,
      dailyGoal: !!dailyGoal,
      startDate,
      endDate,
      date,
      notes,
    });

    const saved = await planner.save();
    console.log("✅ Planner entry saved:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating planner:", err);
    res.status(500).json({ message: "Server Error", details: err.message });
  }
});

/* ======================================================
   📥 GET ALL PLANNERS FOR A USER
   ====================================================== */
router.get("/:userId", async (req, res) => {
  try {
    const planners = await Planner.find({ userId: req.params.userId }).sort({
      date: 1,
    });
    res.json(planners);
  } catch (err) {
    console.error("Error fetching planner:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ======================================================
   ✏️ UPDATE PLANNER ENTRY
   ====================================================== */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Planner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating planner:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ======================================================
   ❌ DELETE PLANNER ENTRY
   ====================================================== */
router.delete("/:id", async (req, res) => {
  try {
    await Planner.findByIdAndDelete(req.params.id);
    res.json({ message: "Planner entry deleted" });
  } catch (err) {
    console.error("Error deleting planner:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ======================================================
   📅 GET PLANNER ENTRIES BY SPECIFIC DATE
   ====================================================== */
router.get("/date/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const planners = await Planner.find({
      userId,
      $or: [
        // 🗓️ Exact single-day planner
        { date: { $gte: dayStart, $lte: dayEnd } },
        // 📆 Range-based daily goal planners
        {
          dailyGoal: true,
          startDate: { $lte: dayEnd },
          endDate: { $gte: dayStart },
        },
      ],
    }).sort({ date: 1 });

    res.json(planners);
  } catch (err) {
    console.error("Error fetching planner by date:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
