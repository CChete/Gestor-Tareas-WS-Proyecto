import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { getTasks, deleteTask } from "../../services/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error cargando tareas:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
      try {
        await deleteTask(taskId);
        await loadTasks();
      } catch (error) {
        console.error("Error eliminando tarea:", error);
        alert(error.message);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tareas</h2>
      
      <TaskForm 
        onTaskCreated={loadTasks}
        editingTask={editingTask}
        onCancelEdit={() => setEditingTask(null)}
      />
      
      <div style={{ marginTop: "30px" }}>
        <h3>Lista de Tareas</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((t) => (
            <li 
              key={t.TaskID}
              style={{ 
                margin: "10px 0", 
                padding: "15px", 
                border: "1px solid #ddd",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <strong>{t.Title}</strong> - 
                Estado: {t.Status} - 
                Prioridad: {t.Priority}
                <div style={{ fontSize: "0.9em", color: "#666" }}>
                  {t.Description && <p>{t.Description}</p>}
                  {t.DueDate && <p>Fecha límite: {new Date(t.DueDate).toLocaleDateString()}</p>}
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => setEditingTask(t)}
                  style={{ padding: "5px 10px" }}
                >
                  Editar
                </button>
                
                <button 
                  onClick={() => handleDelete(t.TaskID)}
                  style={{ 
                    padding: "5px 10px", 
                    background: "#ff4444", 
                    color: "white",
                    border: "none"
                  }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}