import { Routes, Route } from "react-router-dom";
import ArticleList from "./pages/ArticleList";
import ArticleDetail from "./pages/ArticleDetail";
import PageNotFound from "./pages/pageNotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ArticleList />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
