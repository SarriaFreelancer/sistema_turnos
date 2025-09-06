import React, { useState } from "react";
import { registerRequest } from "../api/auth";

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [module, setModule] = useState("A");
  const [adminSecret, setAdminSecret] = useState(import.meta.env.VITE_ADMIN_SECRET || "");

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      const res = await registerRequest({ username, password, module, adminSecret });
      if (res.username) {
        alert('Usuario creado: ' + res.username + " módulo " + res.module);
        setUsername(""); setPassword("");
      } else {
        alert(JSON.stringify(res));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div className="card" style={{maxWidth:480}}>
      <h3>Admin - Crear usuario módulo</h3>
      <form onSubmit={handleCreateUser} style={{marginTop:12}}>
        <div className="form-row">
          <label className="small">Usuario</label>
          <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="small">Contraseña</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="small">Módulo (A,B,C...)</label>
          <input className="input" value={module} onChange={e=>setModule(e.target.value.toUpperCase())} />
        </div>
        <div className="form-row">
          <label className="small">Admin secret</label>
          <input className="input" value={adminSecret} onChange={e=>setAdminSecret(e.target.value)} />
        </div>
        <button className="button" type="submit">Crear usuario módulo</button>
      </form>
      <p className="small" style={{marginTop:10}}>Para seguridad, el panel exige la 'admin secret' para crear usuarios. Puedes usar la variable VITE_ADMIN_SECRET o pegarla aquí.</p>
    </div>
  );
}
