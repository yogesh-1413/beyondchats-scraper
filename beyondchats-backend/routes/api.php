<?php
use App\Http\Controllers\Api\ScraperController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

// This single line creates routes for: GET, POST, PUT, PATCH, and DELETE
Route::apiResource('articles', ArticleController::class);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'beyondchats-backend',
    ]);
});
Route::put('/articles/{id}/reset', [ArticleController::class, 'resetGeneratedContent']);
Route::post('/refresh-articles', [ScraperController::class, 'refreshArticles']);