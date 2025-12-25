import { OpenRouter } from "@openrouter/sdk";

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
    "X-Title": "BeyondChats AI Optimizer",
  },
});

export async function formatWithLLM(originalContent, reference1, reference2) {
  const prompt = `
You are a professional technical content editor.

ORIGINAL ARTICLE:
${originalContent}

REFERENCE ARTICLE 1:
${reference1}

REFERENCE ARTICLE 2:
${reference2}

TASK:
- Improve clarity, structure, and readability
- Keep the original meaning intact
- Use professional tone
- Use headings, bullet points where appropriate
- Do NOT hallucinate facts
- Output ONLY the improved article
`;

  const completion = await openRouter.chat.send({
    model: "openai/gpt-oss-20b:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
    max_tokens: 900,
  });

  return completion.choices[0].message.content;
}
