// backend/routes/sessionRoutes.js
import express from "express";
import StudySession from "../models/StudySession.js";

const router = express.Router();

// POST /api/sessions
// body: { userId, plannerId (optional), date (YYYY-MM-DD or ISO), hours, notes }
router.post("/", async (req, res) => {
  try {
    const { userId, plannerId, date, hours, notes } = req.body;
    if (!userId || !date || hours === undefined) {
      return res.status(400).json({ message: "userId, date and hours are required" });
    }

    const session = await StudySession.create({
      userId,
      plannerId: plannerId || null,
      date: new Date(date),
      hours: Number(hours),
      notes: notes || "",
    });

    res.status(201).json(session);
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/sessions/user/:userId?start=YYYY-MM-DD&end=YYYY-MM-DD
// returns sessions for user, optionally within date range
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { start, end } = req.query;

    const query = { userId };
    if (start || end) {
      const q = {};
      if (start) {
        const s = new Date(start);
        s.setHours(0,0,0,0);
        q.$gte = s;
      }
      if (end) {
        const e = new Date(end);
        e.setHours(23,59,59,999);
        q.$lte = e;
      }
      query.date = q;
    }

    const sessions = await StudySession.find(query).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/sessions/planner/:plannerId
// all sessions tied to a planner entry
router.get("/planner/:plannerId", async (req, res) => {
  try {
    const { plannerId } = req.params;
    const sessions = await StudySession.find({ plannerId }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("Error fetching planner sessions:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
