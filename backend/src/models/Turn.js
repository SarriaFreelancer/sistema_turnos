import mongoose from "mongoose";

const turnSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    module: { type: String, required: true }, // "A", "B", "C"
    cedula: { type: String, required: true },
    nombre: { type: String, required: true },
    status: {
      type: String,
      enum: ["waiting", "attending", "done"],
      default: "waiting",
    },
    callCount: { type: Number, default: 0 }, // cuántas veces se llamó
  },
  { timestamps: true }
);

export default mongoose.model("Turn", turnSchema);
