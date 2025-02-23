export interface OpenFoodFactsProduct {
  status: number;
  product: {
    product_name: string;
    brands: string;
    categories: string;
    quantity: string;
    ecoscore_grade: string;
    labels_tags: string[];
    packaging: string;
    ingredients_text: string;
    image_url: string;
  };
}

export interface ProductSustainabilityData {
  id: string;
  name: string;
  carbonScore: {
    value: number;
    rating: "low" | "medium" | "high";
    details: {
      production: number;
      transportation: number;
      disposal: number;
    };
  };
  certifications: string[];
  recyclable: boolean;
  packagingWarning?: string;
  brand?: string;
  category?: string;
  ingredients?: string[];
  imageUrl?: string;
  sustainabilityBadges: string[];
  impactDetails: {
    waterUsage: string;
    energyConsumption: string;
    materialType: string;
  };
  alternatives?: {
    name: string;
    carbonScore: number;
    savings: number;
  }[];
  quantity?: string;
  nlpAnalysis?: string; // Add NLP analysis results here
  predictiveAnalysis?: any; // Add predictive analysis results here
}
