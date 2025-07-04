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

// Obtiene las tareas asignadas a un usuario
export async function getTasksByUserId(userId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    }
  });
  if (!response.ok) {
    throw new Error("No se pudieron obtener las tareas");
  }
  return await response.json();
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

/**
 * Actualiza una tarea existente
 * @param {number} taskId - ID de la tarea a actualizar
 * @param {object} data - Datos de la tarea a actualizar
 */
export async function updateTask(taskId, data) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
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
    throw new Error(error.error || "Error al actualizar la tarea");
  }

  return res.json();
}

/**
 * Elimina una tarea
 * @param {number} taskId - ID de la tarea a eliminar
 */
export async function deleteTask(taskId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
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
    throw new Error(error.error || "Error al eliminar la tarea");
  }

  return res.json();
}