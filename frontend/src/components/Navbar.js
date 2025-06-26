import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/projects">Proyectos</Link>
      <Link to="/tasks">Tareas</Link>
      {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      <Link to="/profile">Mi Perfil</Link>
      {user ? (
        <button onClick={logout}>Salir ({user.username})</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}