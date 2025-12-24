import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading articles...</p>;

  return (
    <div className="container">
      <h1>BeyondChats Articles</h1>

      {articles.map((a) => (
        <Link key={a.id} to={`/article/${a.id}`} className="card">
          <h3>{a.title}</h3>
          <p>{a.content.slice(0, 120)}...</p>
        </Link>
      ))}
    </div>
  );
}

export default ArticleList;
