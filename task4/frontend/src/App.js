// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import APIDocumentation from "./components/APIDocumentation/APIDocumentation";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import IntroPanel from "./components/IntroPanel/IntroPanel";
import MainPanel from "./components/MainPanel/MainPanel";
import ConclusionPanel from "./components/ConclusionPanel/ConclusionPanel";
import PostsPanel from "./components/PostsPanel/PostsPanel";
import Sidebar from "./components/Sidebar/Sidebar";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="body">
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
