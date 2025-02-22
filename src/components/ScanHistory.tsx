import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClockIcon,
  LeafIcon,
  TreesIcon,
  PackageIcon,
  TagIcon,
  CarIcon,
  SearchIcon,
  ArrowRightIcon,
  Loader2Icon,
} from "lucide-react";
import { ScanHistory as ScanHistoryType } from "../types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScanHistoryProps {
  history: ScanHistoryType[];
  stats: {
    totalScans: number;
    ecoPoints: number;
    carbonSaved: number;
  };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const calculateEcoPoints = (
  score: number,
  ecoPoints: number
): number => {
  if (score <= 2.5) return ecoPoints + 5;
  if (score <= 4) return ecoPoints + 1;
  return ecoPoints - 3;
};

// -------------------------
// Helper functions for sustainability calculations
// -------------------------
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
  return Math.round((totalEmission / quantityInGrams) * 100*100)/100;
}

function calculateCarbonScore(
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
} {
  const baseEmissionRate = 0.0025; // kg CO₂ per gram
  const emissionMultiplier = ecoscore
    ? {
        a: 0.5,
        b: 0.75,
        c: 1,
        d: 1.1,
        e: 1.25,
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
}

// -------------------------
// Updated fetchCO2Impact using sustainability calculations
// -------------------------
const fetchCO2Impact = async (productId: string): Promise<string> => {
  try {
    await delay(1000);
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${productId}.json`
    );
    const data = await response.json();
    if (data.status !== 1) return "N/A";
    const product = data.product;
    const quantityStr = product.quantity || "100 g";
    const quantityInGrams = parseQuantity(quantityStr);
    const ecoscore = product.ecoscore_grade;
    const carbonScore = calculateCarbonScore(ecoscore, quantityInGrams);
    const co2Per100g = calculateCO2Per100g(carbonScore.value, quantityInGrams);
    return String(Math.round(co2Per100g * 100) / 100);
  } catch (error) {
    console.error("Error fetching CO₂ impact:", error);
    return "N/A";
  }
};

export const ScanHistory = ({ history, stats }: ScanHistoryProps) => {
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getCarbonScoreStyle = (score: number) => {
    if (score <= 2) return "bg-green-100 text-green-700";
    if (score <= 4) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const renderBadge = (badge: string) => {
    const badges = {
      organic: { variant: "success", label: "Organic" },
      "fair-trade": { variant: "info", label: "Fair Trade" },
      recyclable: { variant: "secondary", label: "Recyclable" },
      "local-production": { variant: "outline", label: "Local" },
      "zero-waste": { variant: "warning", label: "Zero Waste" },
    };

    const config = badges[badge as keyof typeof badges] || {
      variant: "default",
      label: badge,
    };
    return (
      <Badge key={badge} variant={config.variant as any}>
        {config.label}
      </Badge>
    );
  };

  const getTotalCarbon = () => {
    return history.reduce((total, scan) => total + scan.carbonScore, 0);
  };

  const getEnvironmentalImpact = (totalCarbon: number) => {
    return {
      comparisons: [
        {
          icon: CarIcon,
          title: "Car Travel",
          value: `${(totalCarbon * 4).toFixed(1)} km`,
          description: "Distance a car could travel with the same emissions",
        },
        {
          icon: TreesIcon,
          title: "Tree Absorption",
          value: `${Math.ceil(totalCarbon / 21.7)} trees`,
          description: "Number of trees needed for a year to absorb this CO₂",
        },
        {
          icon: LeafIcon,
          title: "Environmental Impact",
          value: `${(totalCarbon * 0.3).toFixed(1)} m²`,
          description: "Arctic ice at risk of melting from these emissions",
        },
      ],
      effects: [
        "Contributes to global warming through greenhouse gas emissions",
        "Affects local air quality and public health",
        "Impacts wildlife habitats and biodiversity",
      ],
      solutions: [
        "Choose reusable and sustainable alternatives",
        "Support local and eco-friendly products",
        "Properly recycle and dispose of products",
      ],
    };
  };

  const fetchRecommendedProducts = async (productName: string) => {
  try {
    setIsLoading(true);
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${productName}&sort_by=popularity&json=true`
    );
    const data = await response.json();
    const products = data.products || [];
    
    // Filter out products with the same name
    const uniqueProducts = products.filter(
      (product: any) => 
        product.product_name?.toLowerCase() !== productName.toLowerCase()
    );
    
    return uniqueProducts.slice(0, 5); // Return only first 5 unique products
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return [];
  } finally {
    setIsLoading(false);
  }
};

  const handleProductClick = async (scan: ScanHistoryType) => {
  setIsLoading(true);
  setDialogOpen(true);
  try {
    const products = await fetchRecommendedProducts(scan.productName);
    const productsWithCO2 = await Promise.all(
      products.map(async (product) => ({
        ...product,
        co2Impact: await fetchCO2Impact(product.id),
      }))
    );
    setRecommendedProducts(productsWithCO2);
    setSelectedScanId(Number(scan.id));
  } catch (error) {
    console.error("Error processing products:", error);
  } finally {
    setIsLoading(false);
  }
};

  const totalCarbon = getTotalCarbon();
  const impact = getEnvironmentalImpact(totalCarbon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="glass-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Total Scans</h3>
              <p className="text-3xl font-bold text-primary-900 mt-1">
                {stats.totalScans}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="glass-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TreesIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Eco Points</h3>
              {stats.ecoPoints < 0 ? (
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {stats.ecoPoints}
                </p>
              ) : (
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.ecoPoints}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="glass-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <LeafIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-600">CO₂ Saved</h3>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {stats.carbonSaved.toFixed(1)}{" "}
                <span className="text-lg font-medium">kg</span>
              </p>
            </div>
          </div>
        </motion.div> */}

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, delay: 0.4 }}
          className="glass-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <CarIcon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Total CO₂</h3>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {totalCarbon.toFixed(1)}{" "}
                <span className="text-lg font-medium">kg</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Finding Alternatives...
              </>
            ) : (
              <>
                <SearchIcon className="w-5 h-5" />
                Analyze Environmental Impact
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Environmental Impact Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {impact.comparisons.map((comparison, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-green-100 rounded-full opacity-20" />
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <comparison.icon className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-base">
                        {comparison.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-700">
                      {comparison.value}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {comparison.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Environmental Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {impact.effects.map((effect, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        {effect}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {impact.solutions.map((solution, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                Eco-Friendly Alternatives
              </h3>
              {history.map((scan) => (
                <Card
                  key={scan.id}
                  onClick={() => handleProductClick(scan)}
                  className="cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <PackageIcon className="w-4 h-4" />
                      Replace {scan.productName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scan.alternatives?.map((alt, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <LeafIcon className="w-4 h-4 text-green-600" />
                            <span className="font-medium">{alt.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-700">
                            <span>Save {alt.savings.toFixed(1)} kg CO₂</span>
                            <ArrowRightIcon className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2Icon className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-3 text-gray-600">Finding eco-friendly alternatives...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recommended Products</h3>
                {selectedScanId !== null && recommendedProducts.length > 0 ? (
                  recommendedProducts.slice(0, 5).map((product, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <PackageIcon className="w-4 h-4" />
                          {product.product_name || "Unknown Product"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-green-600">
                          Total CO₂ Impact (per 100g): {product.co2Impact} kg
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recommended products found. Try clicking on a product above
                    to see alternatives.
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-primary-900 mb-6 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-primary-500" />
          Recent Scans
        </h3>
        <div className="space-y-4">
          {history.map((scan, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={scan.id}
              className="p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-colors shadow-sm hover:shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    {scan.productName}
                  </p>
                  {scan.brand && (
                    <p className="text-sm text-gray-500">{scan.brand}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    {new Date(scan.timestamp).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${getCarbonScoreStyle(
                    scan.carbonScore
                  )}`}
                >
                  <LeafIcon className="w-4 h-4" />
                  <span className="font-medium">{Math.round(scan.carbonScore*100)/100} kg CO₂</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {scan.category && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <TagIcon className="w-4 h-4" />
                    {scan.category}
                  </div>
                )}
                {scan.recyclable !== undefined && (
                  <div className="flex items-center gap-1 text-sm">
                    <PackageIcon className="w-4 h-4" />
                    <span
                      className={
                        scan.recyclable ? "text-green-600" : "text-red-600"
                      }
                    >
                      {scan.recyclable ? "Recyclable" : "Not Recyclable"}
                    </span>
                  </div>
                )}
              </div>

              {scan.sustainabilityBadges &&
                scan.sustainabilityBadges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {scan.sustainabilityBadges.map((badge) =>
                      renderBadge(badge)
                    )}
                  </div>
                )}
            </motion.div>
          ))}
          {history.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>
                No scans yet. Start scanning products to build your history!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
