import React from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h2>Iniciar Sesión</h2>
      <LoginForm />
    </div>
  );
}