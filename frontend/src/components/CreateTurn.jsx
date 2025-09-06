import React, { useState } from "react";
import { createTurn } from "../api/turns";

export default function CreateTurn({ defaultModule = "A", onCreated }) {
  const [module, setModule] = useState(defaultModule);

  async function handleCreateTurn(e) {
    e.preventDefault();
    try {
      await createTurn(module);
      alert(`Turno creado para módulo ${module}`);
      if (onCreated) onCreated(); // Notifica al padre que se creó un turno
    } catch (err) {
      console.error(err);
      alert("Error al crear el turno");
    }
  }

  return (
  <div className="center-page" style={{maxWidth:400, margin:"5rem auto"}}>
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
        </div>
        <button className="button" type="submit" style={{ width: "100%" }}>
          Crear turno
        </button>
      </form>
    </div>
  </div>
);

}
