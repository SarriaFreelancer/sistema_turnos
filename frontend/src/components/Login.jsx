import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ username, password });
      nav("/");
    } catch (err) {
      alert(err.message || "Error login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:480, margin:"0 auto"}}>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="small">Usuario</label>
            <input className="input" value={username} onChange={(e)=>setUsername(e.target.value)} />
          </div>
          <div className="form-row">
            <label className="small">Contraseña</label>
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <div style={{display:"flex", gap:8}}>
            <button className="button" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
