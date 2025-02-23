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
      text: "output: Organic; low energy production; eco-packaging; sustainable sourcing from local farms",
    },
    {
      text: "input: Peanut Butter: Premium, artisanal peanut butter crafted from 100% organic, non-GMO peanuts, cold-pressed to preserve natural flavor. Batch 2",
    },
    {
      text: "output: Organic; non-GMO; cold-pressed; minimal processing; eco-friendly recyclable packaging; supports local producers",
    },
    {
      text: "input: Peanut Butter: Smooth, velvety peanut butter produced using traditional stone-grinding with organic peanuts and minimal additives. Batch 3",
    },
    {
      text: "output: Organic; traditional stone-grinding method; minimal processing; low carbon footprint; sustainable production practices; biodegradable packaging",
    },
    {
      text: "input: Peanut Butter: All-natural peanut butter made exclusively from organic peanuts with a hint of sea salt, produced in a solar-powered facility. Batch 4",
    },
    {
      text: "output: Organic; all-natural; enhanced with sea salt; produced with renewable solar energy; reduced greenhouse gas emissions; eco-conscious packaging",
    },
    {
      text: "input: Peanut Butter: Crunchy peanut butter featuring organic peanuts mixed with natural seeds, manufactured using energy-efficient processes. Batch 5",
    },
    {
      text: "output: Organic; crunchy texture with added natural seeds; energy-efficient manufacturing; sustainable processing techniques; recyclable packaging",
    },
    {
      text: "input: Doritos: Bold snack with processed ingredients and plastic packaging. Batch 1",
    },
    {
      text: "output: High processing emissions; non-recyclable packaging; high energy use",
    },
    {
      text: "input: Doritos: Spicy Nacho Doritos with vibrant flavor, packaged in non-recyclable materials. Batch 2",
    },
    {
      text: "output: High processing emissions; artificial additives; non-recyclable packaging; environmental waste concerns",
    },
    {
      text: "input: Organic Apple: Fresh, crisp organic apple grown without pesticides and nurtured on sustainable farms. Batch 1",
    },
    {
      text: "output: Organic; low water usage; sustainable farming practices; minimal chemical use; supports local agriculture",
    },
    {
      text: "input: Almond Milk: Smooth almond milk made from sustainably sourced almonds with minimal additives, ensuring a low environmental footprint. Batch 1",
    },
    {
      text: "output: Plant-based; low carbon footprint; sustainably sourced; minimal processing; eco-friendly packaging",
    },
    {
      text: "input: Granola Bar: Granola bar made with organic oats and natural honey, minimally processed and packed in recyclable material. Batch 1",
    },
    {
      text: "output: Organic ingredients; low processing; recyclable packaging; energy-efficient production; eco-friendly",
    },

    { text: `input: ${description}` },
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
    console.error("Error analyzing product description:", error);
    return null;
  }
};
