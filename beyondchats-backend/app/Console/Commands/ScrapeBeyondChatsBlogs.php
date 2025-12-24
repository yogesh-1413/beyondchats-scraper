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
        $this->info('Starting Deep Scrape for the 5 oldest articles...');
        $collectedArticles = [];

        $response = Http::get('https://beyondchats.com/blogs/');
        $crawler = new Crawler($response->body());
        $currentPage = 1;

        // 1. Get total pages
        $crawler->filter('a.page-numbers')->each(function (Crawler $node) use (&$currentPage) {
            $val = trim($node->text());
            if (is_numeric($val) && (int) $val > $currentPage) {
                $currentPage = (int) $val;
            }
        });

        while (count($collectedArticles) < 5 && $currentPage > 0) {
            $this->info("Accessing list page {$currentPage}...");
            $pageResponse = Http::get("https://beyondchats.com/blogs/page/{$currentPage}/");
            $pageCrawler = new Crawler($pageResponse->body());

            $links = $pageCrawler->filter('h2.entry-title a')->each(function (Crawler $node) {
                return $node->attr('href');
            });

            if (empty($links)) {
                $this->warn("No links found on page {$currentPage}. Checking selectors...");
            }

            $links = array_reverse($links);

            foreach ($links as $url) {
                if (count($collectedArticles) < 5) {
                    $this->line("Deep scraping: " . $url);

                    try {
                        $articleResponse = Http::get($url);
                        $articleCrawler = new Crawler($articleResponse->body());
                        $title = 'Untitled';

                        if ($articleCrawler->filter('h1.entry-title')->count()) {
                            $title = $articleCrawler->filter('h1.entry-title')->text();
                        } elseif ($articleCrawler->filter('h1.elementor-heading-title')->count()) {
                            $title = $articleCrawler->filter('h1.elementor-heading-title')->text();
                        } elseif ($articleCrawler->filter('h1')->count()) {
                            $title = $articleCrawler->filter('h1')->first()->text();
                        } elseif ($articleCrawler->filter('')->count()) {

                        }

                        $contentNode = $articleCrawler->filter('.elementor-widget-theme-post-content, .entry-content');
                        $content = $contentNode->count() ? $contentNode->first()->text() : 'Content not found';

                        $collectedArticles[] = [
                            'title' => trim($title),
                            'url' => $url,
                            'content' => trim($content)
                        ];
                    } catch (\Exception $e) {
                        $this->error("Failed to scrape {$url}: " . $e->getMessage());
                    }
                }
            }
            $currentPage--;
        }

        foreach ($collectedArticles as $data) {
            \App\Models\Article::updateOrCreate(
                ['url' => $data['url']],
                ['title' => $data['title'], 'content' => $data['content']]
            );
            $this->info("Successfully saved: " . $data['title']);
        }
        $this->info('Scraping completed. Total articles saved: ' . count($collectedArticles));
    }
}