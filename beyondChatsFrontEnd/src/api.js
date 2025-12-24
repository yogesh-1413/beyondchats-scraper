const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getArticles() {
  const res = await fetch(`${API_BASE}/articles`);
  return res.json();
}

export async function getArticleById(id) {
  const res = await fetch(`${API_BASE}/articles/${id}`);
  return res.json();
}
