import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import IntroPanel from './components/IntroPanel';
import DescriptionPanel from './components/DescriptionPanel';
import ConclusionPanel from './components/ConclusionPanel';
import './index.css';
import './task1.css';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/introduction" element={<IntroPanel />} />
            <Route path="/description" element={<DescriptionPanel />} />
            <Route path="/conclusion" element={<ConclusionPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;