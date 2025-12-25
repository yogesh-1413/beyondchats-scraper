import axios from 'axios';
import* as cheerio from 'cheerio';

export async function getTopTwoLinks(title) {
    try {
        const response = await axios.post('https://google.serper.dev/search',
            { q: title + " blog article" },
            {
                headers: {
                    'X-API-KEY': process.env.SERPER_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const links = response.data.organic
            .map(result => result.link)
            .filter(link => !link.includes('beyondchats.com'))
            .slice(0, 2);

        console.log("Serper found links:", links);
        return links;
    } catch (error) {
        console.error("Serper Error:", error.response?.data || error.message);
        return [];
    }
}

export async function scrapeMainContent(url) {
  try {
    const { data } = await axios.get(url, { 
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const $ = cheerio.load(data);
    
    
    $('script, style, nav, footer, header').remove();
    
    
    return $('body').text().replace(/\s\s+/g, ' ').trim().substring(0, 5000);
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return "Scraping failed for this source Try Another Article or Try Again.";
  }
}

// // Inside your app.post route:
// const links = await getTopTwoLinks(article.title);
// const content1 = await scrapeUrl(links[0]);
// const content2 = await scrapeUrl(links[1]);

// // Update Laravel with BOTH links and scraped content
// await axios.put(`${LARAVEL_API_URL}/${id}`, {
//   reference_links: JSON.stringify(links),
//   ref_content_1: content1,
//   ref_content_2: content2
// });
