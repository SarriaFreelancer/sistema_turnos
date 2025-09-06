import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TVScreen from "./components/TVScreen";
import AdminPanel from "./components/AdminPanel";
import { useAuth } from "./context/AuthContext";
import CreateTurn from "./components/CreateTurn";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="brand">🏥 Sistema de Turnos </Link>
        </div>
        <div className="nav-right">
          <Link to="/tv" className="link">TV</Link>
          <Link to="/Turns" className="link">Turnos</Link>
          <Link to="/admin" className="link">Admin</Link>
          {user ? (
            <>
              <span className="user">Módulo: {user.module}</span>
              <button className="btn-link" onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <Link to="/login" className="link">Login</Link>
          )}
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <div className="hero">Bienvenido — por favor <Link to="/login">inicia sesión</Link> para usar el panel.</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/tv" element={<TVScreen />} />
          <Route path="/Turns" element={<CreateTurn />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}
