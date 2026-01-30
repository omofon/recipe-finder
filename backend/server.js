import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const app = express();

// UPDATED CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:4173", // Vite preview
  process.env.FRONTEND_URL, // Railway frontend URL (we'll set this)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

if (!process.env.HF_ACCESS_TOKEN) {
  console.error("❌ FATAL: HF_ACCESS_TOKEN not found in .env");
  process.exit(1);
}

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// Retry logic with exponential backoff
async function generateWithRetry(ingredients, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await hf.chatCompletion({
        model: "meta-llama/Meta-Llama-3-8B-Instruct", // ← CHANGED TO WORKING MODEL
        messages: [
          { role: "system", content: "You are a professional chef." },
          {
            role: "user",
            content: `
Ingredients: ${ingredients.join(", ")}

Generate a detailed recipe with:
1. Creative recipe title
2. Complete ingredients list with quantities
3. Step-by-step cooking instructions
4. Professional cooking tips

Format in clean Markdown.
`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      return result.choices[0].message.content;
    } catch (err) {
      console.error(`Attempt ${i + 1}/${maxRetries} failed:`, err.message);

      if (i === maxRetries - 1) throw err; // Last attempt, throw error

      // Exponential backoff: wait 1s, 2s, 4s
      const waitTime = Math.pow(2, i) * 1000;
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

app.post("/api/recipe", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "Please provide valid ingredients" });
  }

  try {
    console.log(`🍳 Generating recipe for: ${ingredients.join(", ")}`);
    const recipe = await generateWithRetry(ingredients);
    console.log("✅ Recipe generated successfully");
    res.json({ recipe });
  } catch (err) {
    console.error("❌ Recipe generation failed:", err.message);
    res.status(500).json({
      error: "Failed to generate recipe",
      message: "The AI service is temporarily unavailable. Please try again.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: "meta-llama/Meta-Llama-3-8B-Instruct" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AI backend running on port ${PORT}`);
  console.log(`✅ Using model: meta-llama/Meta-Llama-3-8B-Instruct`);
});