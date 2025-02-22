export interface ProductSustainabilityData {
  id: string;
  name: string;
  carbonScore: {
    value: number;
    rating: 'low' | 'medium' | 'high';
    details: {
      production: number;
      transportation: number;
      disposal: number;
    }
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
}

export interface OpenFoodFactsProduct {
  code: string;
  status: number;
  product: {
    product_name: string;
    brands: string;
    categories: string;
    ingredients_text: string;
    packaging: string;
    ecoscore_grade?: string;
    labels_tags?: string[];
    image_url?: string;
  };
}
