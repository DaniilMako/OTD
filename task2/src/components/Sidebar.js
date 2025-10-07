import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/intro" className={({ isActive }) => (isActive ? "active" : "")}>
              Введение
            </NavLink>
          </li>
          <li>
            <NavLink to="/main" className={({ isActive }) => (isActive ? "active" : "")}>
              Описание
            </NavLink>
          </li>
          <li>
            <NavLink to="/conclusion" className={({ isActive }) => (isActive ? "active" : "")}>
              Заключение
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
