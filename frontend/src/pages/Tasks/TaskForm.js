import React, { useState, useEffect } from "react";
import { createTask, updateTask } from "../../services/api";

export default function TaskForm({ onTaskCreated, editingTask, onCancelEdit }) {
  const [fields, setFields] = useState({
    Title: "",
    Description: "",
    Status: "pending",
    Priority: "medium",
    DueDate: "",
    CreatedBy: "",
    AssignedTo: "",
    ProjectID: "",
  });
  const [msg, setMsg] = useState("");

  // Cargar datos de la tarea cuando se edita
  useEffect(() => {
    if (editingTask) {
      setFields({
        Title: editingTask.Title || "",
        Description: editingTask.Description || "",
        Status: editingTask.Status || "pending",
        Priority: editingTask.Priority || "medium",
        DueDate: editingTask.DueDate?.split('T')[0] || "", // Formatear fecha si existe
        CreatedBy: editingTask.CreatedBy || "",
        AssignedTo: editingTask.AssignedTo || "",
        ProjectID: editingTask.ProjectID || "",
      });
    }
  }, [editingTask]);

  const handleChange = e => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      if (editingTask) {
        // Modo edición
        await updateTask(editingTask.TaskID, fields);
        setMsg("¡Tarea actualizada!");
      } else {
        // Modo creación
        await createTask(fields);
        setMsg("¡Tarea creada!");
        setFields({
          Title: "",
          Description: "",
          Status: "pending",
          Priority: "medium",
          DueDate: "",
          CreatedBy: "",
          AssignedTo: "",
          ProjectID: "",
        });
      }
      onTaskCreated(); // Recargar lista
    } catch (err) {
      setMsg("Error: " + (err.message || "Operación fallida"));
      console.error("Error en el formulario:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</h2>
      
      <div style={{ marginBottom: "10px" }}>
        <input 
          name="Title" 
          value={fields.Title} 
          onChange={handleChange} 
          placeholder="Título" 
          required 
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <textarea
          name="Description"
          value={fields.Description}
          onChange={handleChange}
          placeholder="Descripción"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <select name="Status" value={fields.Status} onChange={handleChange} style={{ flex: 1 }}>
          <option value="pending">Pendiente</option>
          <option value="in-progress">En Progreso</option>
          <option value="completed">Completada</option>
        </select>

        <select name="Priority" value={fields.Priority} onChange={handleChange} style={{ flex: 1 }}>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Fecha límite: </label>
        <input 
          name="DueDate" 
          value={fields.DueDate} 
          onChange={handleChange} 
          type="date" 
          style={{ marginLeft: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <input
          name="CreatedBy"
          value={fields.CreatedBy}
          onChange={handleChange}
          placeholder="Creado por (ID)"
          type="number"
          required
          style={{ flex: 1 }}
        />

        <input
          name="AssignedTo"
          value={fields.AssignedTo}
          onChange={handleChange}
          placeholder="Asignado a (ID)"
          type="number"
          style={{ flex: 1 }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          name="ProjectID"
          value={fields.ProjectID}
          onChange={handleChange}
          placeholder="ID Proyecto"
          type="number"
          required
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" style={{ flex: 1 }}>
          {editingTask ? "Guardar Cambios" : "Crear Tarea"}
        </button>
        
        {editingTask && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            style={{ flex: 1, background: "#ff4444", color: "white" }}
          >
            Cancelar
          </button>
        )}
      </div>

      {msg && <div style={{ marginTop: "10px", color: msg.startsWith("Error") ? "red" : "green" }}>{msg}</div>}
    </form>
  );
}