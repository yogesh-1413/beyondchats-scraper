import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

function ArticleDetails({ id }) {
  const { id: paramId } = useParams();
  const articleId = id || paramId;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`${API}/articles/${articleId}`);
      const data = await res.json();
      setArticle(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/article/${articleId}/`);
      if (response.status === 200) {
        alert("Success! Content optimized.");
        await fetchArticle(); // Refresh data immediately
      }
    } catch (error) {
      console.error("LLM-Service failed:", error);
      alert("Failed to connect to optimization service.");
    } finally {
      setLoading(false);
    }
  };

  // --- CRASH PROOF HELPER ---
  const getSafeLinks = (links) => {
    if (!links) return [];
    if (Array.isArray(links)) return links;
    try {
      return JSON.parse(links);
    } catch (e) {
      return [];
    }
  };

  if (!article) return <div className="p-10 text-center">Loading Article...</div>;

  const safeLinks = getSafeLinks(article.reference_links);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b pb-4">
        <div>
          <Link to="/" className="flex items-center text-blue-500 hover:underline mb-2">
            <ChevronLeft size={18} /> Back to Articles
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">{article.title}</h1>
        </div>
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="mt-4 md:mt-0 bg-black text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-gray-800 transition-all"
        >
          {loading ? "Processing AI..." : "Search Google & Summarize"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* LEFT COLUMN: ORIGINAL */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4 text-gray-700 uppercase tracking-wider">Original Content</h2>
          <div className="text-gray-800 leading-relaxed whitespace-pre-line text-sm h-[600px] overflow-y-auto pr-2">
            {article.content}
          </div>
        </div>

        {/* RIGHT COLUMN: OPTIMIZED & REFERENCES */}
        <div className="flex flex-col gap-6">
          {/* AI Optimized Result */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-lg font-bold mb-4 text-blue-800 uppercase tracking-wider">AI Optimized Content</h2>
            <div className="text-gray-800 leading-relaxed text-sm max-h-[400px] overflow-y-auto">
              {article.updated_content ? (
                <p className="whitespace-pre-line">{article.updated_content}</p>
              ) : (
                <p className="italic text-gray-500">Run summarization to see AI optimized version.</p>
              )}
            </div>
          </div>

          {/* Reference Links */}
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="font-bold text-gray-700 mb-3">Sources Discovered:</h3>
            {safeLinks.length > 0 ? (
              <ul className="space-y-2">
                {safeLinks.map((link, i) => (
                  <li key={i} className="text-sm truncate">
                    <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline italic">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No search results yet.</p>
            )}
          </div>

          {/* Scraped Raw Data (Debugging Phase 2) */}
          {article.ref_content_1 && (
             <div className="bg-white p-4 border rounded-lg">
                <h4 className="text-xs font-bold text-gray-400 mb-2">RAW SCRAPED DATA FROM LINK 1</h4>
                <div className="text-[10px] text-gray-400 h-20 overflow-y-auto bg-gray-50 p-2">
                  {article.ref_content_1}
                </div>
             </div>
          )}
          {article.ref_content_2 && (
             <div className="bg-white p-4 border rounded-lg">
                <h4 className="text-xs font-bold text-gray-400 mb-2">RAW SCRAPED DATA FROM LINK 2</h4>
                <div className="text-[10px] text-gray-400 h-20 overflow-y-auto bg-gray-50 p-2">
                  {article.ref_content_2}
                </div>
             </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default ArticleDetails;