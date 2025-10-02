import { Outlet } from 'react-router-dom';

const MainPanel = () => {
  return (
    <main className="content">
      <Outlet /> {/* Здесь будут отображаться дочерние маршруты */}
    </main>
  );
};

export default MainPanel;
