import { GoogleGenAI, Type } from "@google/genai";
import { ExcuseResponse, SituationType } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getGenAI() {
  if (!aiInstance) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiInstance;
}

export async function generateExcuses(
  situation: string,
  teacherName?: string,
  className?: string
): Promise<ExcuseResponse> {
  const ai = getGenAI();
  const prompt = `Generate three student excuses for the situation: "${situation}".
  ${teacherName ? `Target Teacher/Professor: ${teacherName}.` : ""}
  ${className ? `Class Name: ${className}.` : ""}
  
  Requirements:
  1. Formal: Professional and polite for an email or official note.
  2. Casual: Friendly, relatable, or slightly funny for a text or quick talk.
  3. Convincing: High detail, realistic scenario that makes sense logistically.
  4. Believability: A random funny percentage (0-100) based on how likely a teacher is to believe it.

  Keep it ethical: No harmful, offensive, or illegal content.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            formal: { type: Type.STRING },
            casual: { type: Type.STRING },
            convincing: { type: Type.STRING },
            believability: { type: Type.NUMBER },
          },
          required: ["formal", "casual", "convincing", "believability"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating excuses:", error);
    throw error;
  }
}
