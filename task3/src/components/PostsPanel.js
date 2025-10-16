import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

const PostsPanel = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [postCount, setPostCount] = useState(10);
  const [useAxios, setUseAxios] = useState(true); // Режим: axios / fetch

  // === Загрузка данных через Axios ===
  const loadWithAxios = useCallback(async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
      setPosts(response.data);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      console.error("Axios error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // === Загрузка данных через Fetch ===
  const loadWithFetch = useCallback(async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) throw new Error("Ошибка сети");
      const data = await response.json();
      setPosts(data);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // === Выбор метода загрузки ===
  useEffect(() => {
    if (useAxios) {
      loadWithAxios();
    } else {
      loadWithFetch();
    }
  }, [useAxios, loadWithAxios, loadWithFetch]);

  // === Мемоизация отфильтрованных постов ===
  const memoizedPosts = useMemo(() => {
    return posts.slice(0, postCount);
  }, [posts, postCount]);

  if (isLoading) {
    return (<section><p className="status-message">Загрузка...</p></section>);
  }

  // === Отрисовка компонента ===
  return (
    <section>
      <h2>Посты<span className="anchor">🧷</span></h2>

      {/* Переключатель между axios и fetch */}
      <div className="method-toggle">
        <label>Выбор метода:</label>
        <label>
          <input
            type="radio"
            checked={useAxios}
            onChange={() => setUseAxios(true)}
          />
          Axios
        </label>
        <label>
          <input
            type="radio"
            checked={!useAxios}
            onChange={() => setUseAxios(false)}
          />
          Fetch
        </label>
      </div>

      {/* Контроль количества постов */}
      <div className="range-slider">
        <label>Количество постов:</label>
        <input
          type="range"
          min="1"
          max="100"
          value={postCount}
          onChange={(e) => setPostCount(parseInt(e.target.value))}
        />
        <span>{postCount}</span>
      </div>

      {/* Состояния загрузки/ошибки */}
      {isLoading && <p className="status-message">Загрузка...</p>}
      {isError && <p className="status-message">❌ Ошибка загрузки данных ❌</p>}

      {/* Отображение постов */}
      <ol className="posts-container">
        {memoizedPosts.map((post) => (
          <li key={post.id} className="post-card">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default PostsPanel;