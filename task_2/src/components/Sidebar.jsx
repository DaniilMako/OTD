import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link
              to="/introduction"
              className={location.pathname === '/introduction' ? 'active' : ''}
            >
              Введение
            </Link>
          </li>
          <li>
            <Link
              to="/description"
              className={location.pathname === '/description' ? 'active' : ''}
            >
              Описание
            </Link>
          </li>
          <li>
            <Link
              to="/conclusion"
              className={location.pathname === '/conclusion' ? 'active' : ''}
            >
              Заключение
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;