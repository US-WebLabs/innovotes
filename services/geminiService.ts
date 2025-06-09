import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';
// NewProposalData is no longer needed here as initial proposals come from Google Sheets.
// import { NewProposalData } from "../types"; 

const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("API_KEY for Gemini is not configured in process.env. AI features requiring Gemini will be disabled.");
}

export const generateProposalText = async (topic: string): Promise<string> => {
  if (!ai) {
    console.error("Gemini API client not initialized due to missing API Key. Cannot generate proposal text.");
    throw new Error("API Key for Gemini is not configured. AI features are unavailable.");
  }
  try {
    const prompt = `Generate a detailed, neutral, and informative proposal description for a direct democracy platform based on the following topic: "${topic}".
The proposal should be suitable for public voting.
Focus on clarity and conciseness.
The description should be between 100 and 200 words.
Do not use markdown formatting in your response. Just plain text.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
        }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating proposal text with Gemini:", error);
    if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API key is invalid"))) {
        throw new Error("Invalid API Key for Gemini. Please check your configuration.");
    }
    throw new Error(`Failed to generate proposal description. ${error instanceof Error ? error.message : ''}`);
  }
};

// generateInitialProposals is removed as data will now come from Google Sheets.
// If you need to reinstate it for some reason, ensure it follows the latest Gemini SDK guidelines.
/*
export const generateInitialProposals = async (): Promise<NewProposalData[]> => {
  // ... implementation would go here ...
};
*/
