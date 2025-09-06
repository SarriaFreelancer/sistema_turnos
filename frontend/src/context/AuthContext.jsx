import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("turns_user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("turns_user", JSON.stringify(user));
    else localStorage.removeItem("turns_user");
  }, [user]);

  async function login({ username, password }) {
    const data = await loginRequest({ username, password });
    setUser({ username: data.username, module: data.module, token: data.token, role: data.role });
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
