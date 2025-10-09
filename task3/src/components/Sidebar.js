import { NavLink } from "react-router-dom";

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
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
