import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, role }

  // Simulación de login
  const login = async (username, password) => {
    // agregar peticiones a backend
    // Demo: usuario admin/admin o user/user
    if (username === "admin" && password === "admin") {
      setUser({ username, role: "admin" });
      return { success: true };
    } else if (username === "user" && password === "user") {
      setUser({ username, role: "user" });
      return { success: true };
    }
    return { success: false, message: "Credenciales inválidas" };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}