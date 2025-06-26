import React, { useState } from "react";
import { createTask } from "../../services/api";

export default function TaskForm({ onTaskCreated }) {
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

  const handleChange = e => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await createTask(fields);
      setMsg("Tarea creada!");
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
      onTaskCreated();
    } catch (err) {
      setMsg("Error: " + (err.message || "No se pudo crear"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="Title" value={fields.Title} onChange={handleChange} placeholder="Título" required />
      <input name="Description" value={fields.Description} onChange={handleChange} placeholder="Descripción" />
      <select name="Status" value={fields.Status} onChange={handleChange}>
        <option value="pending">Pendiente</option>
        <option value="in-progress">En Progreso</option>
        <option value="completed">Completada</option>
      </select>
      <select name="Priority" value={fields.Priority} onChange={handleChange}>
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>
      <input name="DueDate" value={fields.DueDate} onChange={handleChange} type="date" />
      <input name="CreatedBy" value={fields.CreatedBy} onChange={handleChange} placeholder="Creado por (UserID)" type="number" required />
      <input name="AssignedTo" value={fields.AssignedTo} onChange={handleChange} placeholder="Asignado a (UserID)" type="number" />
      <input name="ProjectID" value={fields.ProjectID} onChange={handleChange} placeholder="ProjectID" type="number" required />
      <button type="submit">Agregar</button>
      {msg && <span>{msg}</span>}
    </form>
  );
}