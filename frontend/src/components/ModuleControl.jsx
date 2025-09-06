import React, { useState } from "react";
import { nextTurn } from "../api/turns";

export default function ModuleControl({ user, onUpdated, currentTurn }) {
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!user) { alert("Necesitas iniciar sesión"); return; }
    setLoading(true);
    try {
      const res = await nextTurn(user.token);
      if (res.message) {
        alert(res.message);
      } else {
        const code = `${res.module || user.module}${String(res.number).padStart(3,"0")}`;
        const texto = `David Sarria, turno ${code}. Por favor diríjase al módulo ${user.module}`;
        const utter = new SpeechSynthesisUtterance(texto);
        speechSynthesis.speak(utter);
      }
    } catch (err) {
      alert("Error al avanzar turno");
    } finally {
      setLoading(false);
      if (onUpdated) onUpdated();
    }
  }

  return (
    <div className="card">
      <h3>Control - Módulo {user.module}</h3>
      <div style={{marginTop:8}}>
        <div className="small">Turno actual:</div>
        <div className="turn-number">{currentTurn ? `${currentTurn.module || user.module}${String(currentTurn.number).padStart(3,"0")}` : "—"}</div>
      </div>
      <div style={{marginTop:12}}>
        <button className="button" onClick={handleNext} disabled={loading}>{loading ? "..." : "Siguiente"}</button>
      </div>
    </div>
  );
}
