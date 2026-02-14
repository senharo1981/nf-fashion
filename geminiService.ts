
import { GoogleGenAI } from "@google/genai";

export const getTailoringAdvice = async (suitType: string, fabricDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a fashion consultant for a ladies' tailoring shop in Pakistan. 
      The customer is getting a "${suitType}" stitched with "${fabricDescription}" fabric. 
      Suggest 3 trendy neck and sleeve designs suitable for this category in 2 sentences.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our experts recommend traditional intricate embroidery for this suit type.";
  }
};
