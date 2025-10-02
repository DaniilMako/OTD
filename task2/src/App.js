// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import IntroPanel from './components/IntroPanel';
import ConclusionPanel from './components/ConclusionPanel';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <MainPanel>
          <Routes>
            <Route path="/introduction" element={<IntroPanel />} />
            <Route path="/conclusion" element={<ConclusionPanel />} />
            <Route path="/" element={<IntroPanel />} />
          </Routes>
        </MainPanel>
      </div>
    </Router>
  );
};

export default App;
