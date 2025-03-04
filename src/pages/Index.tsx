import { useState } from "react";
import {
  CameraIcon,
  LeafIcon,
  BarChartIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { BarcodeScanner } from "../components/BarcodeScanner";
import { ProductCard } from "../components/ProductCard";
import { ScanHistory } from "../components/ScanHistory";
import { fetchProductSustainabilityData } from "../services/sustainabilityApi";
import { ProductSustainabilityData } from "../types/product";
import { ScanHistory as ScanHistoryType, UserStats } from "../types/user";
import { useToast } from "../hooks/use-toast";
import { SmartEcoAdvisor } from "@/components/SmartEcoAdviser";
import { debounce } from "../lib/utils";
import { calculateEcoPoints } from "../components/ScanHistory"; // Import the calculateEcoPoints function
import { Link } from "react-router-dom";
import About from "../pages/About";

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedProduct, setScannedProduct] =
    useState<ProductSustainabilityData | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryType[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalScans: 0,
    totalEcoChoices: 0,
    ecoPoints: 0,
    carbonSaved: 0,
  });
  const { toast } = useToast();
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  const startScanning = () => {
    setIsScanning(true);
    setScannedProduct(null);
  };

  const handleBarcodeScan = debounce(async (barcode: string) => {
    if (isProcessingScan) return;
    setIsProcessingScan(true);
    setIsLoading(true);
    try {
      const productData = await fetchProductSustainabilityData(barcode);
      setScannedProduct(productData);
      setIsScanning(false);

      // Update scan history
      const newScan: ScanHistoryType = {
        id: Date.now().toString(),
        barcode,
        productName: productData.name,
        timestamp: new Date(),
        carbonScore: productData.carbonScore.value,
      };
      setScanHistory((prev) => [newScan, ...prev].slice(0, 10)); // Keep last 10 scans

      // Update user stats
      setUserStats((prev) => {
        const ecoChoice = productData.carbonScore.rating === "low";
        const points = calculateEcoPoints(
          productData.carbonScore.value,
          prev.ecoPoints
        );
        const carbonSaved = ecoChoice ? 5 : 0; // Assuming 5kg saved for eco-friendly choices

        return {
          totalScans: prev.totalScans + 1,
          totalEcoChoices: prev.totalEcoChoices + (ecoChoice ? 1 : 0),
          ecoPoints: points,
          carbonSaved: prev.carbonSaved + carbonSaved,
        };
      });

      toast({
        title: "Product Found",
        description: `Successfully retrieved data for ${productData.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find product data. Please try scanning again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsProcessingScan(false);
    }
  }, 1000); // Adjust the debounce delay as needed

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100 to-white">
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-primary-900 flex items-center gap-2">
              <LeafIcon className="h-6 w-6" />
              CarbonPrint
            </h1>
            <nav className="space-x-4">
              <Link
                to="./about"
                className="text-primary-700 hover:text-primary-900 transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary-900 mb-4">
            Scan & Learn
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the environmental impact of products instantly with our
            AR-powered scanner. Make informed choices for a sustainable future.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            {!isScanning ? (
              <div className="text-center">
                {scannedProduct ? (
                  <div className="space-y-6">
                    <ProductCard product={scannedProduct} />
                    <button
                      onClick={startScanning}
                      className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white rounded-full px-8 py-4 text-lg font-medium transition-colors"
                    >
                      <CameraIcon className="h-6 w-6" />
                      Scan Another Product
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={startScanning}
                      className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white rounded-full px-8 py-4 text-lg font-medium transition-colors"
                    >
                      <CameraIcon className="h-6 w-6" />
                      Start Scanning
                    </button>
                    <p className="mt-4 text-gray-600">
                      Point your camera at a product's barcode to begin
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <BarcodeScanner
                  onResult={handleBarcodeScan}
                  onError={(error) => {
                    console.error("Scanning error:", error);
                    toast({
                      title: "Scanner Error",
                      description:
                        "There was an error with the barcode scanner. Please try again.",
                      variant: "destructive",
                    });
                  }}
                />
                <button
                  onClick={() => setIsScanning(false)}
                  className="text-primary-700 hover:text-primary-900 transition-colors"
                >
                  Cancel Scanning
                </button>
              </div>
            )}
          </motion.div>
          <SmartEcoAdvisor
            history={scanHistory}
            stats={{
              totalScans: userStats.totalScans,
              ecoPoints: userStats.ecoPoints,
              carbonSaved: userStats.carbonSaved,
            }}
            onSuggestAlternative={async (barcode) => {
              try {
                return await fetchProductSustainabilityData(barcode);
              } catch (error) {
                console.error("Error fetching alternative product:", error);
                return null;
              }
            }}
          />
          {scanHistory.length > 0 && (
            <ScanHistory
              history={scanHistory}
              stats={{
                totalScans: userStats.totalScans,
                ecoPoints: userStats.ecoPoints,
                carbonSaved: userStats.carbonSaved,
              }}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <BarChartIcon className="h-6 w-6 text-primary-500" />
                <h3 className="text-lg font-semibold">Impact Score</h3>
              </div>
              <p className="text-gray-600">
                Get instant carbon footprint ratings and environmental impact
                data
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <LeafIcon className="h-6 w-6 text-primary-500" />
                <h3 className="text-lg font-semibold">Eco Alternatives</h3>
              </div>
              <p className="text-gray-600">
                Discover sustainable alternatives and make better choices
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <RefreshCcwIcon className="h-6 w-6 text-primary-500" />
                <h3 className="text-lg font-semibold">Track Progress</h3>
              </div>
              <p className="text-gray-600">
                Monitor your environmental impact and sustainable choices over
                time
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <footer className="py-4 mt-12 bg-gray-50">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          Created by: Evan Zhou, Kenneth Chen, Vijay Shrivarshan Vijayaraja
        </div>
      </footer>
    </div>
  );
};

export default Index;
