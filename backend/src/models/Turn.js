import mongoose from "mongoose";

const turnSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  module: { type: String, required: true }, // "A", "B", "C"
  status: { type: String, enum: ["waiting", "attending", "done"], default: "waiting" },
}, { timestamps: true });

export default mongoose.model("Turn", turnSchema);
