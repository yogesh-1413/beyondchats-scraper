import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api";
import { BookOpen, Clock, ChevronRight, AlertCircle } from "lucide-react"; // Nice icons

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getArticles();
        setArticles(data);
      } catch (err) {
        setError("Failed to load articles. Please check if the backend is running.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-10 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
             {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 rounded-lg border border-red-200 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={40} />
        <p className="text-red-700 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm bg-red-500 p-2 px-6 rounded-full hover:bg-gray-800 hover:text-red-600 transition-all duration-300">Try Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">BeyondChats Articles</h1>
      </header>

      {articles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500">No articles found in the database.</p>
           <button onClick={() => window.location.reload()} className="mt-4 text-sm bg-gray-500 p-2 px-6 rounded-full hover:bg-gray-800 hover:text-gray-200 transition-all duration-300">Refesh</button>
        </div>
      ) : (
        <div>
          <p className="mb-5 font-bold">Here are the Last 5 Articles From Beyond Chats :</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {articles.map((article) => (
            <div>
              
            <Link 
              key={article.id} 
              to={`/article/${article.id}`} 
              className="group bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${article.updated_content ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {article.updated_content ? 'Optimized' : 'Original'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.content}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <span className="flex items-center text-xs text-gray-400">
                  <Clock size={14} className="mr-1" /> 
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center text-sm font-semibold text-blue-500 group-hover:translate-x-1 transition-transform">
                  View Details <ChevronRight size={16} />
                </span>
              </div>
            </Link>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}

export default ArticleList;