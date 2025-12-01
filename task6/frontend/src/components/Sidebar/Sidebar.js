// frontend/src/components/Sidebar/Sidebar.js
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isAuthenticated, role }) => {
  return (
    <header className="sidebar-header">
      <h1>Русско-эвенский корпус</h1>
      <nav>
        <ul>
          <li><NavLink to="/intro">🚩 Введение</NavLink></li>
          <li><NavLink to="/main">📛 Описание</NavLink></li>
          <li><NavLink to="/conclusion">🏁 Заключение</NavLink></li>
          {isAuthenticated && <li><NavLink to="/posts">📒 Посты</NavLink></li>}
          {isAuthenticated && <li><NavLink to="/image">🖼️ Инвертировать изображение</NavLink></li>}
          
          {role === "admin" && <li><NavLink to="/api">🌐 API</NavLink></li>}
          {role === "admin" && <li><NavLink to="/stats">📊 Статистика</NavLink></li>}
          {!isAuthenticated && <li><NavLink to="/login">👤 Войти</NavLink></li>}
          {isAuthenticated && <li><NavLink to="/profile">🧍 Профиль</NavLink></li>}
        </ul>
      </nav>
    </header>
  );
};

export default Sidebar;
