import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      alert("Регистрация успешна");
      navigate("/login");
    } else {
      alert("Ошибка");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}
