import express from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Register - protected by ADMIN_SECRET (simple approach)
router.post("/register", async (req, res) => {
  try {
    const { username, password, module, adminSecret } = req.body;
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ message: "Admin secret inválido" });
    }
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Usuario ya existe" });
    const user = await User.create({ username, password, module, role: "module" });
    res.json({ username: user.username, module: user.module });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        module: user.module,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
