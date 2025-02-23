import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyC4hF7JQqgpsnJzu_YaEslhnN30yM3gUAE";
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

export const predictEnvironmentalImpact = async (carbonScore: number) => {
  const parts = [
    {
      text: `input: CarbonScore (kg CO₂),EnvironmentalEffects,RecommendedActions\n${carbonScore}`,
    },
    { text: "output: " },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    const responseText = result.response.text();
    console.log("Response from model:", responseText); // Log the response for debugging

    const outputText = responseText.includes("output: ")
      ? responseText.split("output: ")[1].trim()
      : responseText.trim(); // Handle cases where "output: " is not present

    return outputText;
  } catch (error) {
    console.error("Error predicting environmental impact:", error);
    return null;
  }
};
