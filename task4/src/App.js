import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import IntroPanel from "./components/IntroPanel";
import MainPanel from "./components/MainPanel";
import ConclusionPanel from "./components/ConclusionPanel";
import PostsPanel from "./components/PostsPanel";
import "./App.css"; // основу для CSS взял из первого задания
import ImageUpload from "./components/ImageUpload";
import APIDocumentation from "./components/APIDocumentation";

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
