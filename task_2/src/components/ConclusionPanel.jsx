const ConclusionPanel = () => {
  return (
    <section id="conclusion">
      <h2>Заключение</h2>
      <p>Таблица и списки в примере:</p>
      <table>
        <tr><th>Заголовок 1</th><th>Заголовок 2</th></tr>
        <tr><td>Данные 1</td><td>Данные 2</td></tr>
      </table>

      <ul className="custom-list">
        <li>Пункт 1</li>
        <li>Пункт 2</li>
      </ul>
      <ol>
        <li>Первый шаг</li>
        <li>Второй шаг</li>
      </ol>
    </section>
  );
};

export default ConclusionPanel;