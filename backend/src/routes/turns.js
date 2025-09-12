import express from "express";
import Turn from "../models/Turn.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Crear turno público
router.post("/public", async (req, res) => {
  try {
    const { module, cedula, nombre } = req.body;
    if (!module || !cedula || !nombre) {
      return res.status(400).json({ message: "Faltan datos" });
    }
    const lastTurn = await Turn.findOne({ module }).sort({ createdAt: -1 });
    const nextNumber = lastTurn ? lastTurn.number + 1 : 1;
    const newTurn = await Turn.create({
      number: nextNumber,
      module,
      cedula,
      nombre,
    });
    res.status(201).json(newTurn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Avanzar turno
router.put("/next", protect, async (req, res) => {
  try {
    const userModule = req.user.module;
    await Turn.findOneAndUpdate(
      { module: userModule, status: "attending" },
      { status: "done" }
    );
    const next = await Turn.findOneAndUpdate(
      { module: userModule, status: "waiting" },
      { status: "attending", $inc: { callCount: 1 } },
      { new: true }
    );
    if (next) {
      return res.json({
        message: `Ahora atendiendo turno ${next.number} - ${next.nombre} - ${next.module}`,
        turno: next,
      });
    } else {
      return res.json({ message: `No hay más turnos en módulo ${userModule}` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Re-llamar turno actual
router.put("/recall", protect, async (req, res) => {
  try {
    const userModule = req.user.module;
    const current = await Turn.findOneAndUpdate(
      { module: userModule, status: "attending" },
      { $inc: { callCount: 1 } },
      { new: true }
    );
    if (current) {
      return res.json({
        message: `Re-llamando turno ${current.number} - ${current.nombre}`,
        turno: current,
      });
    } else {
      return res.json({ message: "No hay turno en atención actualmente" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar turnos en atención
router.get("/attending", async (req, res) => {
  try {
    const attending = await Turn.find({ status: "attending" })
      .sort({ module: 1 })
      .select("number module nombre callCount");
    res.json(attending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
