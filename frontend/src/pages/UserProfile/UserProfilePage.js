import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function UserProfilePage() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Mi Perfil</h2>
      <p>Usuario: {user?.username}</p>
      <p>Rol: {user?.role}</p>
    </div>
  );
}