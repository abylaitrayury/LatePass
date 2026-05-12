import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for generating excuses
  app.post("/api/generate", async (req, res) => {
    const { situation, teacherName, className } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const genAI = new (GoogleGenAI as any)(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
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

      const prompt = `Generate three student excuses for the situation: "${situation}".
      ${teacherName ? `Target Teacher/Professor: ${teacherName}.` : ""}
      ${className ? `Class Name: ${className}.` : ""}
      
      Requirements:
      1. Formal: Professional and polite for an email or official note.
      2. Casual: Friendly, relatable, or slightly funny for a text or quick talk.
      3. Convincing: High detail, realistic scenario that makes sense logistically.
      4. Believability: A random funny percentage (0-100) based on how likely a teacher is to believe it.

      Keep it ethical: No harmful, offensive, or illegal content. Return as JSON.`;

      const result = await model.generateContent(prompt);
      const response = JSON.parse(result.response.text());
      res.json(response);
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate excuses." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
