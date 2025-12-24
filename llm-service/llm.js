import { GoogleGenerativeAI } from "@google/generative-ai";

export async function formatWithLLM(originalContent, reference1, reference2) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Change 'gemini-pro' to 'gemini-1.5-flash'
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Original Article: ${originalContent}
        Reference 1: ${reference1}
        Reference 2: ${reference2}
        
        Task: Update the original article's formatting and content to be similar to the two reference articles. 
        Maintain a professional tone and ensure the structure is optimized.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}