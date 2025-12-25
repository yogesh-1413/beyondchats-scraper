import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getTopTwoLinks, scrapeMainContent } from './scraper.js';
import { formatWithLLM } from './llm.js';
import axios from 'axios';


const app = express();


app.use(cors());
app.use(express.json());

const LARAVEL_API = process.env.LARAVEL_API_URL;

app.get('/', (req, res) => {
  res.send('LLM Service is running');
});



app.post('/api/article/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Fetch from Laravel
        const articleRes = await axios.get(`${LARAVEL_API}/${id}`);
        const article = articleRes.data;
        console.log(`Step 1: Processing ${article.title}`);

        // Step 2: Search via Serper
        const links = await getTopTwoLinks(article.title);
        console.log(`Step 2: Links found: ${links}`);

        // Step 3: Scrape via Cheerio
        const ref1 = await scrapeMainContent(links[0]);
        const ref2 = await scrapeMainContent(links[1]);
        console.log(`Step 3: Scraping successful (Lengths: ${ref1.length}, ${ref2.length})`);

        // Step 4: Save to Database (Skip Gemini for now)
        await axios.put(`${LARAVEL_API}/${id}`, {
            ref_content_1: ref1,
            ref_content_2: ref2,
            reference_links: links,
            updated_content: "DEBUG MODE: SCRAPING SUCCESSFUL. Gemini step bypassed."
        });

        console.log("Step 4: Database updated.");
        res.status(200).json({ success: true, links });
    } catch (error) {
        console.error("Debug Pipeline Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


const port = process.env.PORT || 5000; // Railway will inject the correct port here
app.listen(port, () => {
    console.log(`LLM Service listening on port ${port}`);
});