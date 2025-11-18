// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import APIDocumentation from "./components/APIDocumentation/APIDocumentation";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import IntroPanel from "./components/IntroPanel/IntroPanel";
import MainPanel from "./components/MainPanel/MainPanel";
import ConclusionPanel from "./components/ConclusionPanel/ConclusionPanel";
import PostsPanel from "./components/PostsPanel/PostsPanel";
import Sidebar from "./components/Sidebar/Sidebar";
import StatsPanel from "./components/StatsPanel/StatsPanel";
import LoginPage from "./components/LoginPage"; // Убедись, что файл в корне components
import RegisterPage from "./components/RegisterPage";

import "./App.css";
import { useEffect, useState } from "react";


const PAGE_ID_MAP = {
  "/intro": 1,
  "/main": 2,
  "/conclusion": 3,
  "/api": 4,
};

function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  // Проверяем токен при инициализации и при смене маршрута
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Декодируем JWT
        setRole(payload.role);
      } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, [location]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
  };


  // Логика KPI — только для авторизованных
  useEffect(() => {
    if (!isAuthenticated) return;

    const pageId = PAGE_ID_MAP[location.pathname];
    if (!pageId) return;

    const token = localStorage.getItem("token");

    // Увеличиваем счётчик
    fetch(`http://localhost:8000/admin/pages/${pageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(console.error);

    const start = performance.now();

    return () => {
      const end = performance.now();
      const seconds = Math.round((end - start) / 1000);

      fetch(`http://localhost:8000/admin/kpi/${pageId}/time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ seconds }),
      }).catch(console.error);
    };
  }, [location.pathname, isAuthenticated]);

  // Редирект, если неавторизован и не на /login или /register
  if (!isAuthenticated && !["/login", "/register"].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {isAuthenticated && (
        <Sidebar 
        showStats={role === "admin"}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout} 
        />
        )}
      <main className="content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/intro" replace />} />
          <Route path="/intro" element={<IntroPanel />} />
          <Route path="/main" element={<MainPanel />} />
          <Route path="/conclusion" element={<ConclusionPanel />} />
          <Route path="/posts" element={<PostsPanel />} />
          <Route path="/image" element={<ImageUpload />} />
          <Route path="/api" element={<APIDocumentation />} />
          {role === "admin" && <Route path="/stats" element={<StatsPanel />} />}
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="body">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
