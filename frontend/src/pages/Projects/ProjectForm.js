import React, { useState } from "react";
import { createProject } from "../../services/api";

export default function ProjectForm({ onProjectCreated }) {
  const [fields, setFields] = useState({
    Name: "",
    Description: "",
    OwnerID: "",
    StartDate: "",
    EndDate: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = e => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await createProject(fields);
      setMsg("Proyecto creado!");
      setFields({ Name: "", Description: "", OwnerID: "", StartDate: "", EndDate: "" });
      onProjectCreated();
    } catch (err) {
      setMsg("Error: " + (err.message || "No se pudo crear"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="Name" value={fields.Name} onChange={handleChange} placeholder="Nombre" required />
      <input name="Description" value={fields.Description} onChange={handleChange} placeholder="Descripción" />
      <input name="OwnerID" value={fields.OwnerID} onChange={handleChange} placeholder="OwnerID" type="number" required />
      <input name="StartDate" value={fields.StartDate} onChange={handleChange} type="date" />
      <input name="EndDate" value={fields.EndDate} onChange={handleChange} type="date" />
      <button type="submit">Agregar</button>
      {msg && <span>{msg}</span>}
    </form>
  );
}