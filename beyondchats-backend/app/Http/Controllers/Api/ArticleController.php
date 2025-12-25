<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    
    public function index()
    {
        return response()->json(Article::all(), 200);
    }

    // CREATE: Manually add a new article
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'url' => 'required|url|unique:articles',
            'content' => 'nullable|string',
        ]);

        $article = Article::create($validated);
        return response()->json($article, 201);
    }

    // READ: View a single article
    public function show($id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }
        return response()->json($article, 200);
    }

    // UPDATE: Modify an existing article
    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $article->updated_content = $request->updated_content;
        $article->reference_links = $request->reference_links;
        $article->is_updated = true;
        $article->updated_at = now();
        $article->update($request->all());
        $article->save();

        return response()->json($article);
    }

    // DELETE: Remove an article
    public function destroy($id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        $article->delete();
        return response()->json(['message' => 'Article deleted successfully'], 200);
    }
    public function resetGeneratedContent($id)
{
    $article = Article::findOrFail($id);

    $article->update([
        'updated_content' => null,
        'reference_links' => null,
        'ref_content_1' => null,
        'ref_content_2' => null,
        'is_updated' => false,
    ]);

    return response()->json([
        'status' => 'ok',
        'message' => 'Generated content erased successfully'
    ]);
}

}