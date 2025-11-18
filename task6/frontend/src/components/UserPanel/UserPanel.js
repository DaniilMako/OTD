// src/components/UserPanel/UserPanel.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPanel.css";
import "../Sidebar/Sidebar.css"

export default function UserPanel({ isAuthenticated, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <li className="user-panel">
      <button onClick={toggle} className="user-button">
        👤<br />{isAuthenticated ? "Меню" : "Войти"}
      </button>
      {isOpen && (
        <ul className="dropdown">
          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout}>Выйти</button>
            </li>
          ) : (
            <>
              <li>
                <button onClick={() => handleNavigate("/login")}>Войти</button>
              </li>
              <li>
                <button onClick={() => handleNavigate("/register")}>Регистрация</button>
              </li>
            </>
          )}
        </ul>
      )}
    </li>
  );
}
