import API from "./client";

export async function createTurn(data) {
  const res = await fetch(`${API}/turns/public`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`❌ Error HTTP: ${res.status}`);
  }

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

  if (!res.ok) {
    const text = await res.text(); // para ver qué devuelve
    throw new Error(`❌ Error HTTP: ${res.status} - ${text}`);
  }

  return res.json();
}


export async function recallTurn(token) {
  const res = await fetch(`${API}/turns/recall`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`❌ Error HTTP: ${res.status} - ${text}`);
  }

  return res.json();
}


