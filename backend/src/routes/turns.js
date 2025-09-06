import express from "express";
import Turn from "../models/Turn.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new turn for a module (public, e.g., reception)
router.post("/", async (req, res) => {
  try {
    const { module } = req.body;
    if (!module) return res.status(400).json({ message: "Module required" });
    const last = await Turn.find({ module }).sort({ number: -1 }).limit(1);
    const nextNumber = last.length ? last[0].number + 1 : 1;
    const t = await Turn.create({ number: nextNumber, module });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all attending turns (for TV)
router.get("/attending", async (req, res) => {
  try {
    const attending = await Turn.find({ status: "attending" }).sort({ module: 1 });
    res.json(attending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get waiting counts (optional)
router.get("/waiting", async (req, res) => {
  try {
    const waiting = await Turn.find({ status: "waiting" }).sort({ createdAt: 1 });
    res.json(waiting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Advance to next turn for the authenticated user's module
router.put("/next", protect, async (req, res) => {
  try {
    const userModule = req.user.module;
    // mark current attending as done
    await Turn.findOneAndUpdate({ module: userModule, status: "attending" }, { status: "done" });
    // set next waiting to attending
    const next = await Turn.findOneAndUpdate(
      { module: userModule, status: "waiting" },
      { status: "attending" },
      { new: true }
    );
    if (next) {
      return res.json(next);
    } else {
      return res.json({ message: `No hay más turnos en módulo ${userModule}` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
