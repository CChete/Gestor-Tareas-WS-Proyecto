import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext"; // Nuevo
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import TasksPage from "./pages/Tasks/TasksPage";
import TasksUserPage from "./pages/Tasks/TaskPageUser";
import AdminPage from "./pages/Admin/AdminPage";
import UserProfilePage from "./pages/UserProfile/UserProfilePage";
import SocketHandler from "./components/SocketHandler";
import Notifications from "./components/Notifications"; // Nuevo componente

function App() {
  return (
    <AuthProvider>
      <NotificationProvider> {/* Envuelve todo con NotificationProvider */}
        <BrowserRouter>
          <Navbar />
          <Notifications /> {/* Componente de notificaciones (puede ir en Navbar también) */}
          <SocketHandler />
          <div style={{ marginLeft: "180px", padding: "24px" }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <PrivateRoute><DashboardPage /></PrivateRoute>
              } />
              <Route path="/projects" element={
                <PrivateRoute><ProjectsPage /></PrivateRoute>
              } />
              <Route path="/tasks" element={
                <PrivateRoute roles={["admin"]}><TasksPage /></PrivateRoute>
              } />            
              <Route path="/tasksUser" element={
                <PrivateRoute roles={["user"]}><TasksUserPage /></PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute roles={["admin"]}><AdminPage /></PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute><UserProfilePage /></PrivateRoute>
              } />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;