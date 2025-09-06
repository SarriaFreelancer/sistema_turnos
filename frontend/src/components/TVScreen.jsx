import React, { useEffect, useState } from "react";
import { getAttendingTurns } from "../api/turns";

export default function TVScreen() {
  const [attending, setAttending] = useState([]);

  async function load() {
    const all = await getAttendingTurns();
    setAttending(all);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>📺 Pantalla TV - Módulos</h2>
        <div style={{marginTop:14}} className="tv-grid">
          {attending.length ? attending.map(t => (
            <div key={t._id} className="tv-card">
              <div className="tv-module">Módulo {t.module}</div>
              <div className="tv-turn">{`${t.module}${String(t.number).padStart(3,"0")}`}</div>
              <div style={{marginTop:6}} className="small">Atendiendo desde: {new Date(t.updatedAt || t.createdAt).toLocaleTimeString()}</div>
            </div>
          )) : (
            <div style={{gridColumn:"1/-1", padding:20, textAlign:"center"}} className="small">No hay turnos siendo atendidos</div>
          )}
        </div>
      </div>
    </div>
  );
}
