<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\Http;
use Illuminate\Console\Command;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;
use App\Models\Category;
class ScrapeBeyondChatsBlogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:beyondchats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape 5 oldest blogs from BeyondChats';


    /**
     * Execute the console command.
     */
 public function handle()
{
    $this->info('Starting scrape...');

    try {
        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
        ])->get('https://beyondchats.com/blogs/');

        $crawler = new Crawler($response->body());
        $lastPage = 1;
        $crawler->filter('a.page-numbers')->each(function (Crawler $node) use (&$lastPage) {
            $val = trim($node->text());
            if (is_numeric($val) && (int)$val > $lastPage) {
                $lastPage = (int)$val;
                $lastPage = $lastPage-1;
            }
        });

        $this->info("Navigating to page: " . $lastPage);

        $oldestResponse = Http::get("https://beyondchats.com/blogs/page/{$lastPage}/");
        $oldestCrawler = new Crawler($oldestResponse->body());

        $oldestCrawler->filter('article')->slice(-5)->each(function (Crawler $node) {
            $title = $node->filter('h2')->count() ? $node->filter('h2')->text() : 'Untitled';
            $url = $node->filter('a')->first()->attr('href');
            
            \App\Models\Article::updateOrCreate(
                ['url' => $url],
                [
                    'title' => trim($title),
                    'content' => 'Oldest blog content from BeyondChats'
                ]
            );
            $this->line("Saved to SQLite: " . trim($title));
        });

        $this->info('Scraping complete!');

    } catch (\Exception $e) {
        $this->error('Something went wrong: ' . $e->getMessage());
    }
}
}