// backend/models/StudySession.js
import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  plannerId: { type: mongoose.Schema.Types.ObjectId, ref: "Planner", required: false },
  date: { type: Date, required: true },     // the day when hours were spent
  hours: { type: Number, required: true },  // number of hours studied in that session
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model("StudySession", studySessionSchema);
