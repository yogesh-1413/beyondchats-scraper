<?php

namespace App\Http\Controllers\Api;

// Add this line to import the base controller correctly
use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\Request;

class ScraperController extends Controller
{
    public function refreshArticles()
    {
        // To prevent timeouts during the long scraping process
        set_time_limit(150); 

        try {
            Artisan::call('scrape:beyondchats');
            
            return response()->json([
                'success' => true,
                'message' => 'Latest articles fetched successfully!',
                'output' => Artisan::output()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Scraper failed: ' . $e->getMessage()
            ], 500);
        }
    }
}