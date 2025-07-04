import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Bienvenido, {user?.username}!</h2>
      <p>Este es tu panel principal.</p>
    </div>
  );
}

