import { ProductSustainabilityData, OpenFoodFactsProduct } from "../types/product";

const mockProducts: Record<string, ProductSustainabilityData> = {
  "8901234567890": {
    id: "8901234567890",
    name: "Eco Water Bottle",
    carbonScore: {
      value: 0.5,
      rating: "low",
      details: {
        production: 0.2,
        transportation: 0.1,
        disposal: 0.2
      }
    },
    certifications: ["Fair Trade", "Recycled Materials"],
    recyclable: true,
    category: "Water Bottle",
    sustainabilityBadges: ["zero-waste", "local-production"],
    impactDetails: {
      waterUsage: "2.5L during production",
      energyConsumption: "0.8 kWh per unit",
      materialType: "100% Recycled Aluminum"
    },
    alternatives: [
      { name: "Reusable Steel Water Bottle", carbonScore: 0.3, savings: 0.2 },
      { name: "Glass Water Bottle", carbonScore: 0.4, savings: 0.1 }
    ]
  },
  "7501234567890": {
    id: "7501234567890",
    name: "Plastic Water Bottle",
    carbonScore: {
      value: 6.2,
      rating: "high",
      details: {
        production: 2.5,
        transportation: 1.2,
        disposal: 2.5
      }
    },
    certifications: [],
    recyclable: true,
    category: "Water Bottle",
    packagingWarning: "Excessive Plastic",
    sustainabilityBadges: [],
    impactDetails: {
      waterUsage: "5.8L per unit (includes production)",
      energyConsumption: "2.4 kWh per unit",
      materialType: "Virgin PET Plastic"
    },
    alternatives: [
      { name: "Reusable Steel Water Bottle", carbonScore: 0.3, savings: 5.9 },
      { name: "Glass Water Bottle", carbonScore: 0.4, savings: 5.8 },
      { name: "Bamboo Water Bottle", carbonScore: 0.5, savings: 5.7 }
    ]
  }
};

function generateSustainabilityBadges(product: OpenFoodFactsProduct['product']): string[] {
  const badges: string[] = [];
  
  if (product.labels_tags?.some(label => label.includes('organic'))) {
    badges.push('organic');
  }
  
  if (product.labels_tags?.some(label => label.includes('fair-trade'))) {
    badges.push('fair-trade');
  }
  
  if (product.packaging?.toLowerCase().includes('recyclable')) {
    badges.push('recyclable');
  }
  
  if (product.labels_tags?.some(label => label.includes('local'))) {
    badges.push('local-production');
  }
  
  return badges;
}

function generateImpactDetails(product: OpenFoodFactsProduct['product']) {
  let waterUsage = "Unknown";
  let energyConsumption = "Unknown";
  let materialType = product.packaging || "Unknown";

  if (product.categories?.toLowerCase().includes('beverages')) {
    waterUsage = "4.5L per unit (including production)";
    energyConsumption = "1.8 kWh per unit";
  } else if (product.categories?.toLowerCase().includes('snacks')) {
    waterUsage = "2.1L per unit";
    energyConsumption = "1.2 kWh per unit";
  } else if (product.categories?.toLowerCase().includes('dairy')) {
    waterUsage = "6.2L per unit";
    energyConsumption = "2.5 kWh per unit";
  }

  return {
    waterUsage,
    energyConsumption,
    materialType
  };
}

const calculateCarbonScore = (ecoscore: string | undefined): { 
  value: number; 
  rating: 'low' | 'medium' | 'high';
  details: {
    production: number;
    transportation: number;
    disposal: number;
  }
} => {
  const baseScore = ecoscore ? {
    'a': 0.5,
    'b': 2.5,
    'c': 4.0,
    'd': 5.0,
    'e': 6.0,
  }[ecoscore] || 3.0 : 3.0;

  return {
    value: baseScore,
    rating: baseScore <= 2 ? 'low' : baseScore <= 4 ? 'medium' : 'high',
    details: {
      production: baseScore * 0.4,
      transportation: baseScore * 0.3,
      disposal: baseScore * 0.3
    }
  };
};

const processLabels = (labels: string[] = []): string[] => {
  return labels
    .map(label => label.replace('en:', ''))
    .filter(label => 
      label.includes('organic') ||
      label.includes('fair-trade') ||
      label.includes('recyclable')
    )
    .map(label => label.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));
};

function generateAlternatives(category: string, currentCarbonScore: number) {
  const alternativesMap = {
    'beverages': [
      { name: "Reusable Steel Water Bottle", carbonScore: 0.3, savings: currentCarbonScore - 0.3 },
      { name: "Glass Water Bottle", carbonScore: 0.4, savings: currentCarbonScore - 0.4 },
      { name: "Bamboo Water Bottle", carbonScore: 0.5, savings: currentCarbonScore - 0.5 }
    ],
    'snacks': [
      { name: "Bulk Snacks in Reusable Container", carbonScore: 0.8, savings: currentCarbonScore - 0.8 },
      { name: "Local Organic Snacks", carbonScore: 1.0, savings: currentCarbonScore - 1.0 }
    ],
    'dairy': [
      { name: "Local Organic Dairy", carbonScore: 1.5, savings: currentCarbonScore - 1.5 },
      { name: "Plant-based Alternative", carbonScore: 0.8, savings: currentCarbonScore - 0.8 }
    ],
    'packaged_foods': [
      { name: "Fresh Local Alternative", carbonScore: 1.2, savings: currentCarbonScore - 1.2 },
      { name: "Bulk Food Option", carbonScore: 0.9, savings: currentCarbonScore - 0.9 }
    ],
    'cleaning_products': [
      { name: "Eco-friendly Concentrate", carbonScore: 0.7, savings: currentCarbonScore - 0.7 },
      { name: "Natural Cleaning Alternative", carbonScore: 0.5, savings: currentCarbonScore - 0.5 }
    ],
    'default': [
      { name: "Eco-friendly Alternative", carbonScore: currentCarbonScore * 0.4, savings: currentCarbonScore * 0.6 },
      { name: "Local Sustainable Option", carbonScore: currentCarbonScore * 0.5, savings: currentCarbonScore * 0.5 }
    ]
  };

  const categoryKey = Object.keys(alternativesMap).find(key => 
    category.toLowerCase().includes(key.toLowerCase()) ||
    (key === 'beverages' && category.toLowerCase().includes('drink')) ||
    (key === 'snacks' && category.toLowerCase().includes('chips')) ||
    (key === 'dairy' && (
      category.toLowerCase().includes('milk') || 
      category.toLowerCase().includes('yogurt') ||
      category.toLowerCase().includes('cheese')
    ))
  ) || 'default';

  return alternativesMap[categoryKey as keyof typeof alternativesMap].map(alt => ({
    ...alt,
    savings: Math.max(0, Number((currentCarbonScore - alt.carbonScore).toFixed(2)))
  }));
}

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

    const carbonScore = calculateCarbonScore(data.product.ecoscore_grade);
    const certifications = processLabels(data.product.labels_tags);
    const alternatives = generateAlternatives(data.product.categories || "", carbonScore.value);
    
    const productData: ProductSustainabilityData = {
      id: barcode,
      name: data.product.product_name || "Unknown Product",
      brand: data.product.brands,
      category: data.product.categories,
      carbonScore,
      certifications,
      recyclable: data.product.packaging?.toLowerCase().includes('recyclable') ?? false,
      packagingWarning: data.product.packaging?.toLowerCase().includes('plastic') 
        ? "Contains Plastic Packaging"
        : undefined,
      ingredients: data.product.ingredients_text?.split(','),
      imageUrl: data.product.image_url,
      sustainabilityBadges: generateSustainabilityBadges(data.product),
      impactDetails: generateImpactDetails(data.product),
      alternatives
    };

    return productData;
  } catch (error) {
    if (mockProducts[barcode]) {
      return mockProducts[barcode];
    }
    throw error;
  }
};
