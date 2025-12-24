import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticleById } from "../api";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    getArticleById(id).then(setArticle);
  }, [id]);

  if (!article) return <p>Loading article...</p>;

  return (
    <div className="container">
      <Link to="/">← Back</Link>

      <h1>{article.title}</h1>
      <p>{article.content}</p>

      {article.references && (
        <>
          <h4>References</h4>
          <ul>
            {article.references.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ArticleDetail;
