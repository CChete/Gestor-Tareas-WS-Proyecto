import React, { useEffect, useState } from "react";
import { getTasksByUserId } from "../../services/api";


export default function TasksUserPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        // Obtén el usuario logueado desde localStorage (ajusta el campo si tu objeto usuario es diferente)
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        if (!userId) {
          setError("No se encontró el usuario logueado.");
          setLoading(false);
          return;
        }

        const tareas = await getTasksByUserId(userId);
        setTasks(tareas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  if (loading) return <div>Cargando tareas...</div>;
  if (error) return <div style={{color:"red"}}>Error: {error}</div>;

  return (
    <div>
      <h2>Mis tareas asignadas</h2>
      {tasks.length === 0 ? (
        <p>No tienes tareas asignadas.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.TaskID}>
              <strong>{task.Title}</strong> - Estado: {task.Status} - Proyecto: {task.ProjectID}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}