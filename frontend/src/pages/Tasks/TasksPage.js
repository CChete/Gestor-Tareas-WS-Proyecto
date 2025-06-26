import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { getTasks } from "../../services/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  return (
    <div>
      <h2>Tareas</h2>
      <TaskForm onTaskCreated={() => getTasks().then(setTasks)} />
      <ul>
        {tasks.map(t => (
          <li key={t.TaskID}>{t.Title} - Estado: {t.Status} - Proyecto: {t.ProjectID}</li>
        ))}
      </ul>
    </div>
  );
}