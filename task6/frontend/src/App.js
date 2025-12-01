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
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";


import "./App.css";
import { useEffect, useState } from "react";


function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [trackedPaths, setTrackedPaths] = useState([]);


  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          localStorage.removeItem("token");
          throw new Error("Invalid token");
        })
        .then((data) => {
          setIsAuthenticated(true);
          setRole(data.role);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setRole(null);
          localStorage.removeItem("token");
        });
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRole(null);
    // Остаться на /intro
  };

  // Загрузка путей
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/admin/pages/paths", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTrackedPaths(Array.isArray(data.paths) ? data.paths : []))
      .catch(() => setTrackedPaths([]));
  }, [isAuthenticated]);


  // KPI
  useEffect(() => {
    if (!isAuthenticated || !Array.isArray(trackedPaths) || trackedPaths.length === 0) return;

    const path = location.pathname;
    if (!trackedPaths.includes(path)) return; // проверяем динамически

    const token = localStorage.getItem("token");
    let start = performance.now();
    let pageId = null;

    fetch(`http://localhost:8000/admin/page/by-path${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        pageId = data.id;
      })
      .catch(console.error);

    const sendTime = (seconds) => {
      if (!pageId || seconds <= 0) return;
      if (window.navigator.sendBeacon) {
        const body = JSON.stringify({ seconds });
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(`http://localhost:8000/admin/kpi/${pageId}/time`, blob);
      } else {
        fetch(`http://localhost:8000/admin/kpi/${pageId}/time`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ seconds }),
        }).catch(console.error);
      }
    };

    const handleBeforeUnload = () => {
      const end = performance.now();
      const seconds = Math.round((end - start) / 1000);
      sendTime(seconds);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      const end = performance.now();
      const seconds = Math.round((end - start) / 1000);
      sendTime(seconds);
    };
  }, [location.pathname, isAuthenticated, trackedPaths]);

  // В AppContent
  const publicPaths = ["/intro", "/main", "/conclusion"];

  if (!isAuthenticated && !["/login", "/register", ...publicPaths].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      {/* 🔝 Сайдбар всегда сверху */}
      <Sidebar isAuthenticated={isAuthenticated} role={role} onLogout={handleLogout} />

      {/* Основной контент — всегда */}
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
          
          <Route path="/profile" element={isAuthenticated ? <ProfilePage role={role} /> : <Navigate to="/login" />} />
          {role === "admin" && <Route path="/api" element={<APIDocumentation />} />}
          {role === "admin" && <Route path="/stats" element={<StatsPanel />} />}
        </Routes>
      </main>
    </div>
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
