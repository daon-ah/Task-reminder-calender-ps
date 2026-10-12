const API_BASE = "/api/tasks";

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return res.json();
}

export async function fetchTasks(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  const query = params.toString();
  const res = await fetch(query ? `${API_BASE}?${query}` : API_BASE);
  return handleResponse(res);
}

export async function fetchTask(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  return handleResponse(res);
}

export async function fetchTasksByDate(dateStr) {
  const res = await fetch(`${API_BASE}/date/${dateStr}`);
  return handleResponse(res);
}

export async function createTask(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function toggleComplete(id, completed) {
  const res = await fetch(`${API_BASE}/${id}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  return handleResponse(res);
}
