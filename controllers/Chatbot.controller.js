const fetch = require("node-fetch"); // Import node-fetch for making API requests

// Function to generate AI-based responses using the Gemini API
const generateResponse = async (req, res) => {
  const { prompt } = req.body; // Extract the prompt from the request body
  const API_KEY = process.env.GEMINI_API_KEY; // Retrieve API key from environment variables
  const API_URL = process.env.GEMINI_API_URL; // Retrieve API URL from environment variables

  // Validate that a prompt is provided
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Make a POST request to the Gemini API with the user prompt
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
  {
    role: "user",
    parts: [
      {
       text: `You are a helpful assistant. Always follow this rule:

- If the question has a direct answer, reply simply.
- If the answer is long, explain it in numbered bullet points (1., 2., 3., etc.)
- Never use paragraphs for long answers.
- Keep each point under 25–30 words.

### Examples:

Question: What is 2+2?  
Answer: 2+2 = 4.

Question: Tell me about Mahatma Gandhi  
Answer:  
1. Gandhi was born in 1869 and became a leader of Indian independence through non-violent resistance.  
2. He promoted civil disobedience, inspiring movements against British rule.  
3. Gandhi was assassinated in 1948, known as the Father of the Nation.

Now answer this:

Question: ${prompt}`
      },
    ],
  },
],
 // Construct API request body
      }),
    });

    const data = await response.json(); // Parse response JSON

    // Handle API errors if response is not OK
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error.message });
    }

    // Send the AI-generated response back to the client
    res.json({ message: data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error("API Error:", error); // Log any errors encountered
    res.status(500).json({ error: "Internal Server Error" }); // Handle server errors
  }
};

module.exports = { generateResponse }; // Export the function for use in other parts of the application
