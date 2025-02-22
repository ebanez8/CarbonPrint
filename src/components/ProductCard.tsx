import { motion } from "framer-motion";
import {
  LeafIcon,
  PackageIcon,
  AlertTriangleIcon,
  TagIcon,
  InfoIcon,
  DropletIcon,
  BoltIcon,
  BoxIcon,
} from "lucide-react";
import { ProductSustainabilityData } from "../types/product";
import { calculateEcoPoints } from "./ScanHistory"; // Import the calculateEcoPoints function

interface ProductCardProps {
  product: ProductSustainabilityData;
  carbonFootprintPer100g?: number | null;
  quantity?: string | null;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const getScoreColor = (rating: string) => {
    switch (rating) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderSustainabilityBadge = (badge: string) => {
    const badges = {
      organic: { bg: "bg-green-100", text: "text-green-700", label: "Organic" },
      "fair-trade": {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Fair Trade",
      },
      recyclable: {
        bg: "bg-teal-100",
        text: "text-teal-700",
        label: "Recyclable",
      },
      "local-production": {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Local Production",
      },
      "zero-waste": {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Zero Waste",
      },
    };

    const badgeConfig = badges[badge as keyof typeof badges] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: badge,
    };

    return (
      <span
        key={badge}
        className={`px-2 py-1 rounded-full text-sm font-medium ${badgeConfig.bg} ${badgeConfig.text}`}
      >
        {badgeConfig.label}
      </span>
    );
  };

  const ecoPointsGained = calculateEcoPoints(product.carbonScore.value, 0); // Calculate eco points gained

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6 w-full"
    >
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-6">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          {product.brand && (
            <p className="text-gray-600 text-sm">{product.brand}</p>
          )}
        </div>
      </div>

      {/* Carbon Score Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Carbon Footprint</h4>
        <div className="space-y-3">
          <div
            className={`px-4 py-2 rounded-lg text-white font-medium flex items-center justify-between ${getScoreColor(
              product.carbonScore.rating
            )}`}
          >
            <div className="flex items-center gap-2">
              <LeafIcon className="w-5 h-5" />
              <span>Total Impact</span>
            </div>
            <span>{product.carbonScore.value.toFixed(2)} kg CO₂</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Object.entries(product.carbonScore.details).map(([key, value]) => (
              <div key={key} className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-600 capitalize">{key}</p>
                <p className="font-medium">{value.toFixed(2)} kg</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainability Badges */}
      {product.sustainabilityBadges.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Sustainability Badges</h4>
          <div className="flex flex-wrap gap-2">
            {product.sustainabilityBadges.map((badge) =>
              renderSustainabilityBadge(badge)
            )}
          </div>
        </div>
      )}

      {/* Impact Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Environmental Impact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <DropletIcon className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Water Usage</p>
              <p className="font-medium">{product.impactDetails.waterUsage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BoltIcon className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Energy</p>
              <p className="font-medium">
                {product.impactDetails.energyConsumption}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BoxIcon className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Material</p>
              <p className="font-medium">
                {product.impactDetails.materialType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 space-y-4">
        {product.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.certifications.map((cert) => (
              <span
                key={cert}
                className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm"
              >
                {cert}
              </span>
            ))}
          </div>
        )}

        {product.packagingWarning && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
            <AlertTriangleIcon className="w-5 h-5" />
            <span>{product.packagingWarning}</span>
          </div>
        )}

        {ecoPointsGained !== 0 && (
          <div
            className={`px-4 py-2 rounded-lg text-white font-medium flex items-center justify-between ${
              ecoPointsGained < 0
          ? "bg-red-500"
          : ecoPointsGained === 1
          ? "bg-yellow-500"
          : ecoPointsGained === 3
          ? "bg-green-500"
          : "bg-gray-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <LeafIcon className="w-5 h-5" />
              <span>
          {ecoPointsGained > 0 ? "Eco Points Gained" : "Eco Points Lost"}
              </span>
            </div>
            <span>{Math.abs(ecoPointsGained)}</span>
          </div>
        )}

        {product.ingredients && product.ingredients.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <InfoIcon className="w-4 h-4" />
              <span className="font-medium">Ingredients:</span>
            </div>
            <p className="text-sm text-gray-600">
              {product.ingredients.join(", ")}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
