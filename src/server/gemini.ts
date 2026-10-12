import { GoogleGenAI } from "@google/genai";

let genAiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  // Support standard naming across Render, Vercel, and local .env files
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY is not configured in the server environment. " +
      "To resolve this in Render: Navigate to your Web Service Dashboard -> 'Environment' tab -> Add Environment Variable -> Key: 'GEMINI_API_KEY' with your Google AI Studio API key. " +
      "If running locally, set GEMINI_API_KEY in your .env file."
    );
  }

  if (!genAiInstance) {
    genAiInstance = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "lexiscan-ai-render",
        },
      },
    });
  }

  return genAiInstance;
}

