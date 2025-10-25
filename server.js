const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// ✅ AI route
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to get AI response: " + error.message });
  }
});

// ✅ Export app instead of app.listen()
module.exports = app;
