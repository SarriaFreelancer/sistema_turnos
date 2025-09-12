import React, { useState } from "react";
import { createTurn } from "../api/turns";

export default function CreateTurn({ defaultModule = "A", onCreated }) {
  const [module, setModule] = useState(defaultModule);
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");

  async function handleCreateTurn(e) {
    e.preventDefault();

    // ✅ Validación antes de enviar
    if (!module.trim() || !cedula.trim() || !nombre.trim()) {
      Swal.fire({
        title: "⚠️ Campos incompletos",
        text: "Debes llenar todos los campos antes de continuar",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#ffd293ff", // Amarillo
        background: "#fff8e1",
        color: "#333"
      });
      return;
    }

    try {
      //console.log("📤 Enviando al servidor:", { module, cedula, nombre });
      await createTurn({ module, cedula, nombre }); // enviar los 3 campos
      Swal.fire({
        title: "✅ ¡Turno creado!",
        text: `Turno creado para módulo ${module}`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#007aedff",
        background: "#f9f9f9",
        color: "#000000ff",
        showClass: { popup: "animate__animated animate__fadeInDown" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" }
      });

      if (onCreated) onCreated();
      setCedula("");
      setNombre("");
      setModule(defaultModule);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "❌ Error",
        text: "Error al crear el turno",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        background: "#fff5f5",
        color: "#333"
      });
    }
  }

  return (
    <div className="center-page" style={{ maxWidth: 400, margin: "5rem auto" }}>
      <div className="card">
        <h3 style={{ textAlign: "center" }}>Recepción - Crear turno</h3>
        <form onSubmit={handleCreateTurn} style={{ marginTop: 12 }}>
          <div className="form-row">
            <label className="small">Módulo (A,B,C...)</label>
            <input
              className="input"
              value={module}
              onChange={(e) => setModule(e.target.value.toUpperCase())}
            />
            <label className="small">Cédula</label>
            <input
              className="input"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
            <label className="small">Nombre completo</label>
            <input
              className="input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <button className="button" type="submit" style={{ width: "100%" }}>
            Crear turno
          </button>
        </form>
      </div>
    </div>
  );
}
