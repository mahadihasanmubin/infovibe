
import { GoogleGenAI } from "@google/genai";

// এপিআই কি সরাসরি প্রসেস এনভায়রনমেন্ট থেকে নেওয়া হচ্ছে
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeNews = async (title: string, content: string): Promise<string> => {
  try {
    const ai = getAIClient();
    // 'gemini-2.5-flash-lite-latest' নিউজ সামারির জন্য বেশি স্ট্যাবল
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `You are a professional news editor. Summarize the following news into exactly 3 clear, punchy lines in Bengali. 
      Use simple language. Do not include any technical jargon or symbols. 
      
      Title: ${title}
      Details: ${content.substring(0, 1000)}`,
      config: { 
        maxOutputTokens: 300, 
        temperature: 0.5,
        // সেফটি সেটিংস শিথিল করা হয়েছে যাতে সাধারণ নিউজ ব্লক না হয়
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

export const validateAndProcessUserPost = async (title: string, content: string, source: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `Act as a news validator. Check if this is a real news piece. Return JSON: 
      { "isValid": boolean, "summary": "3 lines in Bengali", "category": "Politics/Tech/Sports/Entertainment/General", "country": "string" }
      Title: ${title}, Content: ${content}`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { isValid: true, summary: content.substring(0, 120) + "...", category: 'General', country: 'Global' };
  }
};

export const categorizeNews = async (title: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `Return ONLY the category name for this title: "${title}". Options: Politics, Tech, Sports, Entertainment, General.`,
      config: { maxOutputTokens: 20 },
    });
    const category = response.text?.trim() || "General";
    return category;
  } catch (error) {
    return "General";
  }
};
