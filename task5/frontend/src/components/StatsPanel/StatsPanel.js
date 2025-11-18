import { useState, useEffect } from "react";

export default function StatsPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/admin/kpis")
      .then(res => res.json())
      .then(setStats);
  }, []);

  return (
      <div className="main-header">
      <h2>Статистика</h2>
      <table>
        <thead>
          <tr>
            <th>Страница</th>
            <th>Посещения</th>
            <th>Время</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(s => (
            <tr key={s.page_id}>
              <td>{s.title}</td>
              <td>{s.visits}</td>
              <td>{s.time_spent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
