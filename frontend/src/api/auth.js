import API from "./client";

export async function loginRequest({ username, password }) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({message:"Error"}));
    throw new Error(err.message || "Login fallido");
  }
  return res.json();
}

export async function registerRequest({ username, password, module, adminSecret }) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, module, adminSecret })
  });
  return res.json();
}
