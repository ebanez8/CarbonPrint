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

export const predictEnvironmentalImpact = async (historicalData: any) => {
  const parts = [
    {
      text: "input: ScenarioID,CarTravel (km),TreeAbsorption (trees/year), ArcticIceImpact (m²),EnvironmentalEffects,RecommendedActions\n1,1.4,1,0.1",
    },
    {
      text: "output: Contributes to global warming; affects local air quality and public health; impacts wildlife habitats and biodiversity, Choose reusable and sustainable alternatives; support local and eco-friendly products; properly recycle and dispose of products",
    },
    { text: "input: 4,3.0,2,0.2," },
    {
      text: "output: High emissions contributing significantly to global warming; deteriorates air quality; major impact on vulnerable Arctic ice , Switch to eco-friendly alternatives; reduce car usage; support policies for sustainable practices",
    },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error predicting environmental impact:", error);
    return null;
  }
};
