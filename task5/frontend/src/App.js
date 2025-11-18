// App.js
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import APIDocumentation from "./components/APIDocumentation/APIDocumentation";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import IntroPanel from "./components/IntroPanel/IntroPanel";
import MainPanel from "./components/MainPanel/MainPanel";
import ConclusionPanel from "./components/ConclusionPanel/ConclusionPanel";
import PostsPanel from "./components/PostsPanel/PostsPanel";
import Sidebar from "./components/Sidebar/Sidebar";
import StatsPage from "./components/StatsPage/StatsPage";

import "./App.css";
import { useEffect } from "react";

// Обёртка для использования хуков внутри Router
function AppContent() {
  const location = useLocation();

  const PAGE_ID_MAP = {
    "/intro": 5,
    "/main": 6,
    "/conclusion": 7,
    "/api": 8,
  };

  useEffect(() => {
    const pageId = PAGE_ID_MAP[location.pathname];
    if (!pageId) return;

    // Увеличиваем счётчик посещений
    fetch(`http://localhost:8000/admin/pages/${pageId}`).catch(console.error);

    const start = performance.now();

    return () => {
      // При уходе — отправляем время, проведённое на странице
      const end = performance.now();
      const seconds = Math.round((end - start) / 1000);

      fetch(`http://localhost:8000/admin/kpi/${pageId}/time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seconds }),
      }).catch(console.error);
    };
  }, [location.pathname]);

  return (
    <>
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/"           element={<Navigate to="/intro" replace />} />
          <Route path="/intro"      element={<IntroPanel />} />
          <Route path="/main"       element={<MainPanel />} />
          <Route path="/conclusion" element={<ConclusionPanel />} />
          <Route path="/posts"      element={<PostsPanel />} />
          <Route path="/image"      element={<ImageUpload />} />
          <Route path="/api"        element={<APIDocumentation />} />
          <Route path="/stats"      element={<StatsPage />} />
        </Routes>
      </main>
    </>
  );
}

// Основной компонент
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
