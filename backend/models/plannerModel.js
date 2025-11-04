import mongoose from "mongoose";

const plannerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  targetHours: { type: Number, required: true },
  priority: { type: String, default: "Medium" },
  dailyGoal: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  date: { type: Date, required: true },
  notes: { type: String },
}, { timestamps: true });

const Planner = mongoose.model("Planner", plannerSchema);
export default Planner;
