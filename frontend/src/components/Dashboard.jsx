import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ModuleControl from "./ModuleControl";
import { getAttendingTurns } from "../api/turns";
import CreateTurn from "./CreateTurn"; // <-- importamos

export default function Dashboard() {
  const { user } = useAuth();
  const [attending, setAttending] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);

  async function fetchAttending() {
    const all = await getAttendingTurns();
    setAttending(all);
    if (user) {
      const cur = all.find((t) => t.module === user.module);
      setCurrentTurn(cur || null);
    }
  }

  useEffect(() => {
    fetchAttending();
    const id = setInterval(fetchAttending, 2000);
    return () => clearInterval(id);
  }, [user]);

  return (
    <div className="grid">
      <div>
        {/* <CreateTurn
          defaultModule={user ? user.module : "A"}
          onCreated={fetchAttending} // Refresca turnos al crear
        /> */}
        <div style={{ marginTop: 18 }}>
          <h4>Turnos atendiendo (vista rápida)</h4>
          <div className="tv-grid" style={{ marginTop: 10 }}>
            {attending.length
              ? attending.map((t) => (
                  <div key={t._id} className="card module">
                    <div className="small">Módulo {t.module}</div>
                    <div className="turn-nome">{t.nombre}</div>
                    <div className="turn-number">
                      {`${t.module}${String(t.number).padStart(3, "0")}`}
                    </div>
                    <div className="small">Estado: {t.status}</div>
                  </div>
                ))
              : <div className="small">No hay turnos atendiendo</div>}
          </div>
        </div>
      </div>

      <div>
        {user ? (
          <ModuleControl
            user={user}
            currentTurn={currentTurn}
            onUpdated={fetchAttending}
          />
        ) : (
          <div className="card">
            <h3>Accede con tu usuario</h3>
            <p className="small">Inicia sesión para controlar tu módulo</p>
          </div>
        )}
      </div>
    </div>
  );
}
