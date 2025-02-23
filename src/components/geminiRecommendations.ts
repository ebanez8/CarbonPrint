//// filepath: /Users/kennethchen/Code/CarbonPrint/src/components/geminiRecommendations.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyC4hF7JQqgpsnJzu_YaEslhnN30yM3gUAE"; // Replace with your secured API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 50, // Adjust tokens for a short output
  responseMimeType: "text/plain",
};

export const condenseProductInfo = async (title: string,) => {
//   const prompt = `Condense the following product title and description into 1-2 descriptive words:

// Title: ${title}
console.log(title);
Output:;
const parts = [
    {
        text: "input: Lays Potato Chips",
    },
    {
        text: "output: Potato Chips",
    },
    {
        text: "input: Di Giorno's",
    },
    {
        text: "output: Pizza",
    },
    {
        text: "input: Snickers Bar",
    },
    {
        text: "output: Candy Bar",
    },
    {
        text: "input: Coca-Cola 33cl",
    },
    {
        text: "output: Soda",
    },
    {
        text: "input: Oreo Cookies",
    },
    {
        text: "output: Cookies",
    },
    {
        text: "input: Tropicana Orange Juice",
    },
    {
        text: "output: Orange Juice",
    },
    {
        text: "input: Ben & Jerry's Ice Cream",
    },
    {
        text: "output: Ice Cream",
    },
    {
        text: "input: Ritz Crackers",
    },
    {
        text: "output: Crackers",
    },
    {
        text: "input: Campbell's Tomato Soup",
    },
    {
        text: "output: Soup",
    },
    {
        text: "input: Quaker Oats",
    },
    {
        text: "output: Oatmeal",
    },
    {
        text: "input: Red Bull",
    },
    {
        text: "output: Energy Drink",
    },
    {
        text: "input: Skippy Peanut Butter",
    },
    {
        text: "output: Peanut Butter",
    },
    {
        text: "input: Kellogg's Corn Flakes",
    },
    {
        text: "output: Cereal",
    },
    {
        text: "input: Gatorade",
    },
    {
        text: "output: Sports Drink",
    },
    {
        text: "input: KitKat",
    },
    {
        text: "output: Chocolate Bar",
    },
    {
        text: "input: Pringles Original",
    },
    {
        text: "output: Potato Chips",
    },
    {
        text: "input: Hershey's Kisses",
    },
    {
        text: "output: Chocolate Candy",
    },
    {
        text: "input: Mountain Dew",
    },
    {
        text: "output: Soda",
    },
    {
        text: "input: Reese's Peanut Butter Cups",
    },
    {
        text: "output: Candy",
    },
    {
        text: "input: Nutella",
    },
    {
        text: "output: Hazelnut Spread",
    },
    {
        text: "input: Doritos Nacho Cheese",
    },
    {
        text: "output: Chips",
    },
    {
        text: "input: Fanta Orange",
    },
    {
        text: "output: Soda",
    },
    {
        text: "input: M&M's",
    },
    {
        text: "output: Chocolate Candy",
    },
    {
        text: "input: Starbucks Frappuccino",
    },
    {
        text: "output: Coffee Drink",
    },
    {
        text: "input: Tim Hortons Double Double",
    },
    {
        text: "output: Coffee",
    },
    {
        text: "input: Twinkies",
    },
    {
        text: "output: Snack Cake",
    },
    {
        text: "input: Cheetos",
    },
    {
        text: "output: Cheese Snacks",
    },
    {
        text: "input: Tostitos Salsa",
    },
    {
        text: "output: Salsa",
    },
    {
        text: "input: Frosted Flakes",
    },
    {
        text: "output: Cereal",
    },
    {
        text: "input: Pop-Tarts",
    },
    {
        text: "output: Pastry Snack",
    },
    {
        text: "input: Smarties",
    },
    {
        text: "output: Candy",
    },
    {
        text: "input: Uncle Ben's Rice",
    },
    {
        text: "output: Rice",
    },
    {
        text: "input: Lean Cuisine",
    },
    {
        text: "output: Frozen Meal",
    },
    {
        text: "input: Welch's Grape Juice",
    },
    {
        text: "output: Juice",
    },
    {
        text: "input: Jif",
    },
    {
        text: "output: Peanut Butter",
    },
    {
        text: "input: Planters Peanuts",
    },
    {
        text: "output: Peanuts",
    },
    {
        text: "input: Swiss Miss Hot Chocolate",
    },
    {
        text: "output: Hot Cocoa",
    },
    {
        text: "input: Ruffles All Dressed",
    },
    {
        text: "output: Chips",
    },
    {
        text: "input: Ferrero Rocher",
    },
    {
        text: "output: Chocolate",
    },
    {
        text: "input: Honey Nut Cheerios",
    },
    {
        text: "output: Cereal",
    },
    {
        text: "input: Clif Bar",
    },
    {
        text: "output: Energy Bar",
    },
    {
        text: "input: Triscuit Crackers",
    },
    {
        text: "output: Crackers",
    },
    {
        text: "input: Barilla Penne Pasta",
    },
    {
        text: "output: Pasta",
    },
    {
        text: "input: Philadelphia Cream Cheese",
    },
    {
        text: "output: Cream Cheese",
    },
    {
        text: "input: Gushers",
    },
    {
        text: "output: Fruit Snacks",
    },
    {
        text: "input: Minute Maid Lemonade",
    },
    {
        text: "output: Lemonade",
    },
    {
        text: "input: Welch's Fruit Snacks",
    },
    {
        text: "output: Fruit Snacks",
    },
    {
        text: "input: Green Giant Frozen Vegetables",
    },
    {
        text: "output: Frozen Vegetables",
    },
    {
        text: "input: Rice Krispies Treats",
    },
    {
        text: "output: Cereal Bar",
    },
    {
        text: "input: Skittles",
    },
    {
        text: "output: Candy",
    },
    {
        text: "input: Maltesers",
    },
    {
        text: "output: Chocolate Candy",
    },
    {
        text: "input: Twix",
    },
    {
        text: "output: Chocolate Bar",
    },
    {
        text: "input: Sprite",
    },
    {
        text: "output: Soda",
    },
    {
        text: "input: Sunny D",
    },
    {
        text: "output: Juice",
    },
    {
        text: "input: Kettle Chips",
    },
    {
        text: "output: Potato Chips",
    },
    {
        text: "input: Lunchables",
    },
    {
        text: "output: Snack Pack",
    },
    {
        text: "input: Mr. Noodles",
    },
    {
        text: "output: Instant Noodles",
    },
    {
        text: "input: Haribo Goldbears",
    },
    {
        text: "output: Gummy Candy",
    },
    {
        text: "input: Lindt Chocolate",
    },
    {
        text: "output: Chocolate",
    },
    {
        text: "input: Goldfish Crackers",
    },
    {
        text: "output: Crackers",
    },
    {
        text: "input: Stouffer's Lasagna",
    },
    {
        text: "output: Frozen Meal",
    },
    {
        text: "input: Eggo Waffles",
    },
    {
        text: "output: Frozen Waffles",
    },
    {
        text: "input: Häagen-Dazs",
    },
    {
        text: "output: Ice Cream",
    },
    {
        text: "input: Yoo-hoo",
    },
    {
        text: "output: Chocolate Drink",
    },
    {
        text: "input: Powerade",
    },
    {
        text: "output: Sports Drink",
    },
    {
        text: "input: Canada Dry Ginger Ale",
    },
    {
        text: "output: Soda",
    },
    {
        text: "input: V8 Original",
    },
    {
        text: "output: Vegetable Juice",
    },
    {
        text: "input: Capri Sun",
    },
    {
        text: "output: Juice",
    },
    {
        text: "input: Nesquik Chocolate Milk",
    },
    {
        text: "output: Chocolate Milk",
    },
    {
        text: "input: Starbucks Pike Place Roast",
    },
    {
        text: "output: Coffee",
    },
    {
        text: "input: Ocean Spray Cranberry Juice",
    },
    {
        text: "output: Juice",
    },
    {
        text: "input: Five Gum",
    },
    {
        text: "output: Chewing Gum",
    },
    { text: `input: ${title}` },
    { text: "output: " },
];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });
    const responseText = result.response.text();
    console.log("Response from model:", responseText); // Log the response for debugging
    return responseText.trim();
  } catch (error) {
    console.error("Error condensing product info:", error);
    return "";
  }
};