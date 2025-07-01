import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects">Proyectos</NavLink>
          </li>
          <li>
            <NavLink to="/tasks">Tareas</NavLink>
          </li>
          {user && user.role === "admin" && (
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/profile">Mi Perfil</NavLink>
          </li>
        </ul>
      </nav>
      {user && (
        <button className="logout-btn" onClick={handleLogout}>
          Salir ({user.role})
        </button>
      )}
    </aside>
  );
}