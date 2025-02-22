import {
  ProductSustainabilityData,
  OpenFoodFactsProduct,
} from "../types/product";

const mockProducts: Record<string, ProductSustainabilityData> = {
  // Add mock products here if needed
};

export const fetchProductSustainabilityData = async (
  barcode: string
): Promise<ProductSustainabilityData> => {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (!response.ok) {
      throw new Error("Product not found in Open Food Facts");
    }

    const data: OpenFoodFactsProduct = await response.json();

    if (data.status !== 1) {
      throw new Error("Product not found");
    }

    const quantityStr = data.product.quantity || "100 g";
    const quantityInGrams = parseQuantity(quantityStr);

    const carbonScore = calculateCarbonScore(
      data.product.ecoscore_grade,
      quantityInGrams
    );

    const certifications = processLabels(data.product.labels_tags);
    const alternatives = generateAlternatives(
      data.product.categories || "",
      carbonScore.value
    );

    const productData: ProductSustainabilityData = {
      id: barcode,
      name: data.product.product_name || "Unknown Product",
      brand: data.product.brands,
      category: data.product.categories,
      carbonScore,
      certifications,
      recyclable:
        data.product.packaging?.toLowerCase().includes("recyclable") ?? false,
      packagingWarning: data.product.packaging
        ?.toLowerCase()
        .includes("plastic")
        ? "Contains Plastic Packaging"
        : undefined,
      ingredients: data.product.ingredients_text?.split(","),
      imageUrl: data.product.image_url,
      sustainabilityBadges: generateSustainabilityBadges(data.product),
      impactDetails: generateImpactDetails(data.product),
      alternatives,
      quantity: quantityStr,
    };

    return productData;
  } catch (error) {
    if (mockProducts[barcode]) {
      return mockProducts[barcode];
    }
    throw error;
  }
};

function parseQuantity(quantityStr: string): number {
  const match = quantityStr.match(/(\d+(\.\d+)?)\s*(g|kg|ml|l)/i);
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[3].toLowerCase();
    switch (unit) {
      case "kg":
      case "l":
        return value * 1000;
      case "g":
      case "ml":
        return value;
      default:
        return 100; // default to 100g if unit is not recognized
    }
  }
  return 100; // default to 100g if parsing fails
}

function calculateCO2Per100g(
  totalEmission: number,
  quantityInGrams: number
): number {
  if (quantityInGrams <= 0) return 0;
  return (totalEmission / quantityInGrams) * 100;
}

function generateSustainabilityBadges(
  product: OpenFoodFactsProduct["product"]
): string[] {
  const badges: string[] = [];

  if (product.labels_tags?.some((label) => label.includes("organic"))) {
    badges.push("organic");
  }

  if (product.labels_tags?.some((label) => label.includes("fair-trade"))) {
    badges.push("fair-trade");
  }

  if (product.packaging?.toLowerCase().includes("recyclable")) {
    badges.push("recyclable");
  }

  if (product.labels_tags?.some((label) => label.includes("local"))) {
    badges.push("local-production");
  }

  return badges;
}

function generateImpactDetails(product: OpenFoodFactsProduct["product"]) {
  let waterUsage = "Unknown";
  let energyConsumption = "Unknown";
  let materialType = product.packaging || "Unknown";

  if (product.categories?.toLowerCase().includes("beverages")) {
    waterUsage = "4.5L per unit (including production)";
    energyConsumption = "1.8 kWh per unit";
  } else if (product.categories?.toLowerCase().includes("snacks")) {
    waterUsage = "2.1L per unit";
    energyConsumption = "1.2 kWh per unit";
  } else if (product.categories?.toLowerCase().includes("dairy")) {
    waterUsage = "6.2L per unit";
    energyConsumption = "2.5 kWh per unit";
  }

  return {
    waterUsage,
    energyConsumption,
    materialType,
  };
}

const calculateCarbonScore = (
  ecoscore: string | undefined,
  quantityInGrams: number
): {
  value: number;
  rating: "low" | "medium" | "high";
  details: {
    production: number;
    transportation: number;
    disposal: number;
  };
} => {
  const baseEmissionRate = 0.0025; // Adjusted base emission rate (kg CO₂ per gram)
  const emissionMultiplier = ecoscore
    ? {
        a: 0.5,
        b: 0.75,
        c: 1,
        d: 1.1,
        e: 1.25, // Capped to prevent excessive inflation
      }[ecoscore] || 1
    : 1;

  const totalEmission = baseEmissionRate * emissionMultiplier * quantityInGrams;

  const rating =
    totalEmission < 0.3 ? "low" : totalEmission < 1 ? "medium" : "high";

  return {
    value: totalEmission,
    rating,
    details: {
      production: totalEmission * 0.6,
      transportation: totalEmission * 0.25,
      disposal: totalEmission * 0.15,
    },
  };
};

const processLabels = (labels: string[] = []): string[] => {
  return labels
    .map((label) => label.replace("en:", ""))
    .filter(
      (label) =>
        label.includes("organic") ||
        label.includes("fair-trade") ||
        label.includes("recyclable")
    )
    .map((label) =>
      label
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
};

function generateAlternatives(category: string, currentCarbonScore: number) {
  const alternativesMap = {
    beverages: [
      {
        name: "Reusable Steel Water Bottle",
        carbonScore: 0.3,
        savings: currentCarbonScore - 0.3,
      },
      {
        name: "Glass Water Bottle",
        carbonScore: 0.4,
        savings: currentCarbonScore - 0.4,
      },
      {
        name: "Bamboo Water Bottle",
        carbonScore: 0.5,
        savings: currentCarbonScore - 0.5,
      },
    ],
    snacks: [
      {
        name: "Bulk Snacks in Reusable Container",
        carbonScore: 0.8,
        savings: currentCarbonScore - 0.8,
      },
      {
        name: "Local Organic Snacks",
        carbonScore: 1.0,
        savings: currentCarbonScore - 1.0,
      },
    ],
    dairy: [
      {
        name: "Local Organic Dairy",
        carbonScore: 1.5,
        savings: currentCarbonScore - 1.5,
      },
      {
        name: "Plant-based Alternative",
        carbonScore: 0.8,
        savings: currentCarbonScore - 0.8,
      },
    ],
  };

  const categoryKey = Object.keys(alternativesMap).find((key) =>
    category.toLowerCase().includes(key)
  );
  return categoryKey
    ? alternativesMap[categoryKey as keyof typeof alternativesMap]
    : [];
}
