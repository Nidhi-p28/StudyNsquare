import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  relatedSubject: { type: String, required: true },
  deadline: { type: Date, required: true },
  estimatedTime: { type: Number },
  importance: { type: String, default: "Medium" },
  status: { type: String, default: "Pending" },
  userId: { type: String, required: true }, // to track who created it
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
