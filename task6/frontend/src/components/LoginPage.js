// src/components/LoginPage.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ← добавь Link

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } else {
      alert("Ошибка входа");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required
      />
      <button type="submit">Войти</button>

      {/* Ссылка на регистрацию */}
      <p style={{ marginTop: "15px" }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </form>
  );
}
