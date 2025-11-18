import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/intro" className={({ isActive }) => (isActive ? "active" : "")}>
              🚩<br/>Введение
            </NavLink>
          </li>
          <li>
            <NavLink to="/main" className={({ isActive }) => (isActive ? "active" : "")}>
              📛<br/>Описание
            </NavLink>
          </li>
          <li>
            <NavLink to="/conclusion" className={({ isActive }) => (isActive ? "active" : "")}>
              🏁<br/>Заключение
            </NavLink>
          </li>
          <li>
            <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
              📒<br/>Посты
            </NavLink>
          </li>
          <li>
            <NavLink to="/image" className={({ isActive }) => (isActive ? "active" : "")}>
              🖼️<br/>Загрузка изображений
            </NavLink>
          </li>
          <li>
            <NavLink to="/api" className={({ isActive }) => (isActive ? "active" : "")}>
              🌐<br/>API
            </NavLink>
          </li>
          <li>
            <NavLink to="/stats" className={({ isActive }) => (isActive ? "active" : "")}>
              📊<br/>Статистика
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
