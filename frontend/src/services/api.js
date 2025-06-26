const API_URL = "http://localhost:3000/api";

// Proyectos
export async function getProjects() {
  const res = await fetch(`${API_URL}/projects`);
  return res.json();
}

export async function createProject(data) {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || "Error API");
}

// Tareas
export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || "Error API");
}