const API_URL = "http://localhost:3000/api";


// Proyectos
export async function getProjects() {
  const token = localStorage.getItem("token"); //obtenemos el token para acceder a las rutas protegidas solamente al iniciar
//sesion
  const res = await fetch(`${API_URL}/projects`, {
    headers: {
      "Content-Type": "application/json",//incluimos el token en el encabezado para autorizar la operacion
      "Authorization": `Bearer ${token}`
    }
  });
   if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
  const error = await res.json();
  throw new Error(error.message || "Error al crear el proyecto");
}
  return res.json();
}

export async function createProject(data) {
  const token = localStorage.getItem("token"); //obtenemos el token para acceder a las rutas protegidas solamente al iniciar
//sesion
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //incluimos el token en el encabezado para autorizar la operacion
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
  const error = await res.json();
  throw new Error(error.message || "Error al crear el proyecto");
}
}

// Tareas
export async function getTasks() {
  const token = localStorage.getItem("token"); //obtenemos el token para acceder a las rutas protegidas solamente al iniciar
//sesion
  const res = await fetch(`${API_URL}/tasks`, {
    headers: {
      "Content-Type": "application/json", //incluimos el token en el encabezado para autorizar la operacion
      "Authorization": `Bearer ${token}`
    }
  });
 if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
  const error = await res.json();
  throw new Error(error.message || "Error al crear el proyecto");
}
  return res.json();
}

export async function createTask(data) {
  const token = localStorage.getItem("token"); //obtenemos el token para acceder a las rutas protegidas solamente al iniciar
//sesion
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  //incluimos el token en el encabezado para autorizar la operacion
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
  const error = await res.json();
  throw new Error(error.message || "Error al crear el proyecto");
}
  if (!res.ok) throw new Error((await res.json()).error || "Error API");
}