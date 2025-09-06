import API from "./client";

export async function createTurn(module) {
  const res = await fetch(`${API}/turns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ module })
  });
  return res.json();
}

export async function getAttendingTurns() {
  const res = await fetch(`${API}/turns/attending`);
  return res.json();
}

export async function nextTurn(token) {
  const res = await fetch(`${API}/turns/next`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
