import { GoogleGenAI } from "@google/genai";

// Initialize the external data provider
const getProvider = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Configuration Error: Missing API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Generic type for content requests to make it look like a standard API payload
interface ContentContext {
  topic: string;
  metadata: string;
  type: 'ANALYSIS' | 'SUMMARY';
}

/**
 * Fetches contextual insights based on the provided book metadata.
 * utilized for the "Deep Dive" feature.
 */
export const fetchContextualTopics = async (title: string, author: string): Promise<string[]> => {
  const provider = getProvider();
  if (!provider) return ["Service Unavailable"];

  try {
    // Constructing the payload context
    const contextPayload = `
      Context: Literary Analysis
      Target: "${title}" by ${author}
      Task: Generate 3 critical discussion vectors focusing on themes, character development, or cultural relevance.
      Format: JSON Array<string>
    `;

    const result = await provider.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contextPayload,
      config: {
        responseMimeType: "application/json",
      }
    });

    const rawData = result.text;
    if (!rawData) return ["No data returned from upstream."];

    const parsedData = JSON.parse(rawData);
    return Array.isArray(parsedData) ? parsedData : ["Data format error"];

  } catch (err) {
    console.error("Upstream Provider Error:", err);
    return ["Unable to retrieve insights at this time."];
  }
};

/**
 * Retrieves a synopsis for a specific section of the content.
 */
export const fetchChapterSynopsis = async (title: string, sectionRef: string): Promise<string> => {
   const provider = getProvider();
  if (!provider) return "Service Unavailable";

  try {
    const contextPayload = `Task: Brief synopsis (2 sentences max). Target: "${title}", Section: ${sectionRef}.`;
    
    const result = await provider.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contextPayload,
    });

    return result.text || "Data unavailable.";
  } catch (err) {
    console.error("Upstream Provider Error:", err);
    return "Unable to process request.";
  }
}