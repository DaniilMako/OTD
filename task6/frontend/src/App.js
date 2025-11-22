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
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

import "./App.css";
import { useEffect, useState } from "react";


function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  // Проверка токена при загрузке и смене маршрута
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Декод JWT
        setRole(payload.role);
      } catch (e) {
        console.error("Invalid token", e);
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

  // Логика KPI: счётчик посещений и времени
  useEffect(() => {
    if (!isAuthenticated) return;

    const path = location.pathname;
    const allowedPaths = ["/intro", "/main", "/conclusion", "/api"];
    if (!allowedPaths.includes(path)) return;

    const token = localStorage.getItem("token");
    let start = performance.now();
    let pageId = null;

    // Запрашиваем данные страницы → получаем pageId и увеличиваем счётчик
    fetch(`http://localhost:8000/admin/page/by-path${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load page");
        return res.json();
      })
      .then((data) => {
        pageId = data.id;
      })
      .catch((err) => {
        console.error("KPI fetch error:", err);
      });

    // Функция отправки времени
    const sendTime = (seconds) => {
      if (!pageId || seconds <= 0) return;

      // Попытка через sendBeacon (для F5 и закрытия вкладки)
      if (window.navigator.sendBeacon) {
        const body = JSON.stringify({ seconds });
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(`http://localhost:8000/admin/kpi/${pageId}/time`, blob);
      } else {
        // Резерв: обычный fetch (работает при навигации)
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

    // При закрытии вкладки или F5
    const handleBeforeUnload = () => {
      const end = performance.now();
      const seconds = Math.round((end - start) / 1000);
      sendTime(seconds);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // При навигации (очистка эффекта)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      const end = performance.now();
      const seconds = Math.round((end - start) / 1000);
      sendTime(seconds);
    };
  }, [location.pathname, isAuthenticated]);

  // Редирект на /login, если неавторизован
  if (!isAuthenticated && !["/login", "/register"].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {isAuthenticated && (
        <Sidebar
          showStats={role === "admin"}
          isAuthenticated={isAuthenticated}
          role={role}
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

          {/* Только для админов */}
          {role === "admin" && <Route path="/api" element={<APIDocumentation />} />}
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
