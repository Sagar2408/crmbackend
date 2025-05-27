const fetch = require("node-fetch");

// Function to generate AI-based responses using Gemini API
const generateResponse = async (req, res) => {
  const { prompt } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = process.env.GEMINI_API_URL;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    console.log("✅ Chatbot controller hit:", req.body.prompt);

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error.message });
    }

    const reply = data.candidates[0].content.parts[0].text;
    return res.json({ message: reply });
  } catch (error) {
    console.error("🔥 Gemini API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { generateResponse };
