
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. The production environment MUST have the API_KEY set.
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const askGemini = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("ERROR: API_KEY not configured. Cannot connect to CEREBRO. Please check system environment variables.");
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an elite hacker's AI assistant from the 90s. Your name is CEREBRO. You respond with a retro-futuristic, cyberpunk flair. Be concise and to the point. The user is a fellow hacker.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `// CEREBRO CONNECTION FAILED: ${(error as Error).message}. The Gibson might be down.`;
  }
};