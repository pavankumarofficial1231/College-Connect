import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export const generateSummary = async (description: string): Promise<string> => {
  if (!description) {
    throw new Error("Description cannot be empty.");
  }

  const prompt = `Based on the following project description, generate a catchy, one-sentence summary for a project listing board. The summary should be concise, engaging, and capture the essence of the project.

Description: "${description}"

Summary:`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        maxOutputTokens: 50,
        // Disable thinking for faster, more direct responses for this specific task
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const summary = response.text.trim();
    if (!summary) {
        throw new Error("AI returned an empty summary.");
    }
    
    // Clean up potential markdown or quotes
    return summary.replace(/^["']|["']$/g, '');

  } catch (error) {
    console.error("Error generating summary with Gemini API:", error);
    throw new Error("Failed to connect to the AI service. Please check your connection or API key.");
  }
};
