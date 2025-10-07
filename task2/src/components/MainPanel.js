const MainPanel = () => {
  return (
    <section id="description">
      <h2>Описание<span class="anchor">#</span></h2>
      <p><strong>Эве́нский язы́к</strong> (уст. ламутский) — язык эвенов, близок к эвенкийскому, нанайскому,
          удэгейскому. Относится к тунгусо-маньчжурской семье.</p>
      
      <p>Небольшая информация:</p>
      <div class="box">
          <p><strong>Интересный факт:</strong> Эвены относятся к коренным малочисленным народам с численностью менее
              <em>20 тыс</em>.</p>
      </div>

      <p>Источник: <a href="https://ru.wikipedia.org/wiki/Эвенский_язык">ссылка на Википедию</a></p>

      <div class="image-container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Расселение_эвенов_2010.png/500px-Расселение_эвенов_2010.png"
             alt="Карта расселения эвенов в РФ на 2010г год"/>
        <img src="https://i.pinimg.com/736x/9a/6f/b2/9a6fb20006451318e4260394deb107fc.jpg"
             alt="Эвенский алфавит" class="animated-image"/>
      </div>

      {/* Таблица */}
      <table>
          <tr>
              <th>Характеристика</th>
              <th>Русский</th>
              <th>Эвенский</th>
          </tr>
          <tr>
              <td>Число говорящих (2010г)</td>
              <td>137,5 млн</td>
              <td>5656</td>
          </tr>
          <tr>
              <td>Количество букв в алфавите (кириллица)</td>
              <td>33</td>
              <td>36</td>
          </tr>
          <tr>
              <td>Число падежей</td>
              <td>6</td>
              <td>13</td>
          </tr>
      </table>
    </section>
  );
};

export default MainPanel;
