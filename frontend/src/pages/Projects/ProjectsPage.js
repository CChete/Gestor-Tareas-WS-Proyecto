import React, { useEffect, useState } from "react";
import ProjectForm from "./ProjectForm";
import { getProjects } from "../../services/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <div>
      <h2>Proyectos</h2>
      <ProjectForm onProjectCreated={() => getProjects().then(setProjects)} />
      <ul>
        {projects.map(p => (
          <li key={p.ProjectID}>{p.Name} - Owner: {p.OwnerID}</li>
        ))}
      </ul>
    </div>
  );
}