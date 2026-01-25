import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDiscussionQuestions = async (bookTitle: string, author: string): Promise<string[]> => {
  const ai = getAiClient();
  if (!ai) return ["AI Service Unavailable - Check API Key"];

  try {
    const prompt = `Generate 3 thought-provoking, deep discussion questions for the book "${bookTitle}" by ${author}. 
    Focus on themes relevant to African literature if applicable. 
    Return ONLY the questions as a JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return ["Could not generate questions."];

    const questions = JSON.parse(text);
    return Array.isArray(questions) ? questions : ["Invalid response format"];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["Failed to generate discussion topics. Please try again later."];
  }
};

export const summarizeChapter = async (bookTitle: string, chapter: string): Promise<string> => {
   const ai = getAiClient();
  if (!ai) return "AI Service Unavailable";

  try {
    const prompt = `Provide a concise 2-sentence summary of what typically happens in chapter ${chapter} (or the early chapters if specific chapter unknown) of "${bookTitle}".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate summary.";
  }
}
