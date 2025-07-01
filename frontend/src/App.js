import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import TasksPage from "./pages/Tasks/TasksPage";
import AdminPage from "./pages/Admin/AdminPage";
import UserProfilePage from "./pages/UserProfile/UserProfilePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
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
              <PrivateRoute><TasksPage /></PrivateRoute>
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
    </AuthProvider>
  );
}

export default App;