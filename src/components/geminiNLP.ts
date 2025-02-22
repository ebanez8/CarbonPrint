import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyC4hF7JQqgpsnJzu_YaEslhnN30yM3gUAE"; // Directly include the API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const analyzeProductDescription = async (description: string) => {
  const parts = [
    {
      text: "input: Peanut Butter: Rich, creamy peanut butter made with organic peanuts. Batch 1",
    },
    {
      text: "output: Extracted Info: Organic; low energy production; eco-packaging;",
    },
    {
      text: "input: Doritos: Bold snack with processed ingredients and plastic packaging. Batch 1",
    },
    {
      text: "output: Extracted Info: High processing emissions; non-recyclable packaging;",
    },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error analyzing product description:", error);
    return null;
  }
};
