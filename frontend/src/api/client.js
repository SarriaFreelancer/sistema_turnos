// src/api.js
const isProduction = import.meta.env.MODE === "production";

const API = isProduction
  ? "https://sistematurnos-production.up.railway.app/api" // producción
  : import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // desarrollo

console.log("Usando API en:", API);

export default API;
