import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

// ДОБАВИТЬ FETCH И ВЫБОР СПОСОБА GET ЗАПРОСА



const PostsPanel = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [postCount, setPostCount] = useState(10);

  // загрузка данных через axios
  // благодаря useCallback - не будет повторного запроса
  const axiosPosts = useCallback(async () => {
    try {
      // GET-запрос к API
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
      
      // Сохраняем данные в состоянии
      setPosts(response.data);
      setIsError(false);

    // Обработка ошибок
    } catch (error) {
      setIsError(true);
      console.error("Axios error:", error);
    } finally {
      // Снимаем флаг загрузки
      setIsLoading(false);
    }
  }, []);

  // Вызов запроса при монтировании
  useEffect(() => {
    axiosPosts()
  }, [axiosPosts]);

  // Мемоизация отфильтрованных постов
  const memoizedPosts = useMemo(() => {
    return posts.slice(0, postCount);  // Отбираем первые N постов
  }, [posts, postCount]);

  return (
    <div>
      <h2>Посты<span class="anchor">🧷</span></h2>

      <label> Количество постов:
        <input
          type="range"
          min="1"
          max="50"
          value={postCount}
          onChange={(e) => setPostCount(parseInt(e.target.value))}
        />
        {postCount}
      </label>

      {isLoading && <p>Загрузка...</p>}
      {isError && <p>❌Ошибка загрузки данных❗❌</p>}

      <ol>
        {memoizedPosts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PostsPanel;