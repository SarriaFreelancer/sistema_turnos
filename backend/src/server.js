import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import turnRoutes from "./routes/turns.js";

dotenv.config();
connectDB();

const app = express();

// Detectar entorno
const isProduction = process.env.NODE_ENV === "production";

// Dominios permitidos según entorno
const allowedOrigins = isProduction
  ? ["https://sistematurnos-production.up.railway.app"] // frontend producción
  : ["http://localhost:5173"];                            // frontend desarrollo

// Configurar CORS dinámico
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // permite Postman u otras herramientas
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("No permitido por CORS"));
    }
  }
}));

// Parse JSON
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/turns", turnRoutes);

app.get("/", (req, res) => res.send("API Turnos - Funcionando"));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Entorno: ${isProduction ? "producción" : "desarrollo"}`);
});
