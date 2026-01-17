
import { GoogleGenAI, Type } from "@google/genai";

// এপিআই কি সরাসরি প্রসেস এনভায়রনমেন্ট থেকে নেওয়া হচ্ছে
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeNews = async (title: string, content: string): Promise<string> => {
  try {
    const ai = getAIClient();
    // Use gemini-3-flash-preview for basic text tasks like summarization as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional news editor. Summarize the following news into exactly 3 clear, punchy lines in Bengali. 
      Use simple language. Do not include any technical jargon or symbols. 
      
      Title: ${title}
      Details: ${content.substring(0, 1000)}`,
      config: { 
        maxOutputTokens: 300, 
        temperature: 0.5,
      },
    });

    const result = response.text?.trim();
    if (!result || result.length < 5) {
      return "দুঃখিত, এই খবরের পর্যাপ্ত তথ্য পাওয়া যায়নি।";
    }
    return result;
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    // যদি এআই সামারি করতে ব্যর্থ হয়, তবে খবরের প্রথম ১০০ অক্ষর সামারি হিসেবে দেখাবে
    return content.length > 20 ? content.substring(0, 150) + "..." : "খবরটির বিস্তারিত জানতে মূল লিঙ্কে ক্লিক করুন।";
  }
};

export const translateTitle = async (title: string): Promise<string> => {
  // যদি টাইটেলে বাংলা অক্ষর থাকে, তবে অনুবাদের প্রয়োজন নেই
  if (/[\u0980-\u09FF]/.test(title)) return title;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate this news headline into a single short line of natural sounding Bengali. 
      Headline: "${title}"`,
      config: { maxOutputTokens: 100, temperature: 0.3 },
    });
    return response.text?.trim() || title;
  } catch (error) {
    return title;
  }
};

export const validateAndProcessUserPost = async (title: string, content: string, source: string) => {
  try {
    const ai = getAIClient();
    // Updated to gemini-3-flash-preview and implemented responseSchema for robust JSON output
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a news validator. Check if this is a real news piece. 
      Title: ${title}, Content: ${content}`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: {
              type: Type.BOOLEAN,
              description: "Whether the news content is valid and not fake."
            },
            summary: {
              type: Type.STRING,
              description: "A 3-line summary of the news in Bengali."
            },
            category: {
              type: Type.STRING,
              description: "The news category: Politics, Tech, Sports, Entertainment, or General."
            },
            country: {
              type: Type.STRING,
              description: "The country the news is related to."
            }
          },
          required: ["isValid", "summary", "category", "country"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Validation Error:", error);
    return { isValid: true, summary: content.substring(0, 120) + "...", category: 'General', country: 'Global' };
  }
};

export const categorizeNews = async (title: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Return ONLY the category name for this title: "${title}". Options: Politics, Tech, Sports, Entertainment, General.`,
      config: { maxOutputTokens: 20 },
    });
    const category = response.text?.trim() || "General";
    return category;
  } catch (error) {
    console.error("Gemini Categorization Error:", error);
    return "General";
  }
};
