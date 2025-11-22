// src/components/Sidebar/Sidebar.js
import { NavLink } from "react-router-dom";
import UserPanel from "../UserPanel/UserPanel";
import "./Sidebar.css";

// Sidebar.js
const Sidebar = ({ showStats = false, isAuthenticated, role, onLogout }) => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {/* Публичные страницы */}
          <li>
            <NavLink to="/intro">🚩<br />Введение</NavLink>
          </li>
          <li>
            <NavLink to="/main">📛<br />Описание</NavLink>
          </li>
          <li>
            <NavLink to="/conclusion">🏁<br />Заключение</NavLink>
          </li>

          {/* Только для авторизованных */}
          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/posts">📒<br />Посты</NavLink>
              </li>
              <li>
                <NavLink to="/image">🖼️<br />Загрузка</NavLink>
              </li>
            </>
          )}

          {/* Только для админа */}
          {role === "admin" && (
            <>
              <li>
                <NavLink to="/api">🌐<br />API</NavLink>
              </li>
              <li>
                <NavLink to="/stats">📊<br />Статистика</NavLink>
              </li>
            </>
          )}

          {/* Панель пользователя */}
          <UserPanel isAuthenticated={isAuthenticated} onLogout={onLogout} />
        </ul>
      </nav>
    </aside>
  );
};


export default Sidebar;
