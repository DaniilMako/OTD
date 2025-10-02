// src/components/DescriptionPanel.jsx
const DescriptionPanel = () => {
  return (
    <section id="description">
      <h2>Подзаголовок<span className="anchor">#</span></h2>
      <p>Пример блочного элемента:</p>
      <div className="box">Блочный элемент (div)</div>
      <p>Примеры строчных элементов: <em>курсив</em>, <a href="#">ссылка</a></p>
      <img 
        src="/img/алфавит.jpg" 
        alt="Пример изображения" 
        className="animated-image" 
      />
    </section>
  );
};

export default DescriptionPanel;
