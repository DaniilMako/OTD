import { animatedImage } from '../assets'; // Импортируйте изображение

const DescriptionPanel = () => {
  return (
    <section id="description">
      <h2>Подзаголовок<span className="anchor">#</span></h2>
      <p>Пример блочного элемента:</p>
      <div className="box">Блочный элемент (div)</div>
      <p>Примеры строчных элементов: <em>курсив</em>, <a href="#">ссылка</a></p>
      <img src={animatedImage} alt="Пример изображения" className="animated-image" />
    </section>
  );
};

export default DescriptionPanel;