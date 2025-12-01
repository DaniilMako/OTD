// src/components/ProfilePage/ProfilePage.js
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProfilePage.css";


// Конфиг API
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function ProfilePage({ role }) {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.sub || "Неизвестный пользователь");
    } catch (e) {
      console.error("Invalid token", e);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Скачать KPI и pages
  const handleDownloadKPI = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/export-db`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Не удалось скачать базу");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "otd_backup_kpi_pages.json";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Ошибка: " + error.message);
    }
  };

  // Скачать users и roles
  const handleDownloadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/export-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Не удалось скачать пользователей");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "otd_backup_users.json";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Ошибка: " + error.message);
    }
  };

    // === Загрузка списка пользователей ===
  useEffect(() => {
    const loadUsers = async () => {
      if (!role || role !== "admin") return;

      setLoadingUsers(true);
      try {
        const response = await fetch(`${API_URL}/admin/export-users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Не удалось загрузить пользователей");

        const data = await response.json();
        setUsers(data.users || []);
        // setSelectedUserEmail(email); // уже выше
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
        alert("Не удалось загрузить список пользователей");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [role, email]); // Загружаем, когда role и email известны

    // === Загрузка текущего пользователя ===
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.sub || "Неизвестный пользователь");
      setSelectedUserEmail(payload.sub); // По умолчанию — сам админ
    } catch (e) {
      console.error("Invalid token", e);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  return (
    <div className="profile-page">
      <h2>Профиль пользователя</h2>
      <div className="profile-info">
        <p><strong>Логин:</strong> {email}</p>
      </div>

      {role === "admin" && (
        <div>
          <button onClick={handleDownloadKPI} className="download-db-button">
            📥 Скачать копию БД: <b>KPI и Pages</b>
          </button>
          <br /><br />
          <button onClick={handleDownloadUsers} className="download-db-button">
            📥 Скачать копию БД: <b>Пользователи и Роли</b>
          </button>
          <br /><br />
        </div>
      )}

      <button onClick={handleLogout} className="logout-button">
        Выйти
      </button>
    </div>
  );
}

