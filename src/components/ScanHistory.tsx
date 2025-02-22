import { motion } from "framer-motion";
import { ClockIcon, LeafIcon, TreesIcon, PackageIcon, TagIcon, CarIcon, SearchIcon, ArrowRightIcon } from "lucide-react";
import { ScanHistory as ScanHistoryType } from "../types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScanHistoryProps {
  history: ScanHistoryType[];
  stats: {
    totalScans: number;
    ecoPoints: number;
    carbonSaved: number;
  };
}

export const ScanHistory = ({ history, stats }: ScanHistoryProps) => {
  const getCarbonScoreStyle = (score: number) => {
    if (score <= 2) return 'bg-green-100 text-green-700';
    if (score <= 4) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const renderBadge = (badge: string) => {
    const badges = {
      'organic': { variant: 'success', label: 'Organic' },
      'fair-trade': { variant: 'info', label: 'Fair Trade' },
      'recyclable': { variant: 'secondary', label: 'Recyclable' },
      'local-production': { variant: 'outline', label: 'Local' },
      'zero-waste': { variant: 'warning', label: 'Zero Waste' }
    };

    const config = badges[badge as keyof typeof badges] || { variant: 'default', label: badge };
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
          description: "Distance a car could travel with the same emissions"
        },
        {
          icon: TreesIcon,
          title: "Tree Absorption",
          value: `${Math.ceil(totalCarbon / 21.7)} trees`,
          description: "Number of trees needed for a year to absorb this CO₂"
        },
        {
          icon: LeafIcon,
          title: "Environmental Impact",
          value: `${(totalCarbon * 0.3).toFixed(1)} m²`,
          description: "Arctic ice at risk of melting from these emissions"
        }
      ],
      effects: [
        "Contributes to global warming through greenhouse gas emissions",
        "Affects local air quality and public health",
        "Impacts wildlife habitats and biodiversity"
      ],
      solutions: [
        "Choose reusable and sustainable alternatives",
        "Support local and eco-friendly products",
        "Properly recycle and dispose of products"
      ]
    };
  };

  const totalCarbon = getTotalCarbon();
  const impact = getEnvironmentalImpact(totalCarbon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-3xl font-bold text-primary-900 mt-1">{stats.totalScans}</p>
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
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.ecoPoints}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
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
                {stats.carbonSaved.toFixed(1)} <span className="text-lg font-medium">kg</span>
              </p>
            </div>
          </div>
        </motion.div>
        
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
                {totalCarbon.toFixed(1)} <span className="text-lg font-medium">kg</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="w-full gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            size="lg"
          >
            <SearchIcon className="w-5 h-5" />
            Analyze Environmental Impact
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Environmental Impact Analysis</DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {impact.comparisons.map((comparison, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-green-100 rounded-full opacity-20" />
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <comparison.icon className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-base">{comparison.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-700">{comparison.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{comparison.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Environmental Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {impact.effects.map((effect, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
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
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Eco-Friendly Alternatives</h3>
              {history.map((scan) => (
                <Card key={scan.id}>
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
                  <p className="font-medium text-gray-900">{scan.productName}</p>
                  {scan.brand && (
                    <p className="text-sm text-gray-500">{scan.brand}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    {new Date(scan.timestamp).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${getCarbonScoreStyle(scan.carbonScore)}`}>
                  <LeafIcon className="w-4 h-4" />
                  <span className="font-medium">{scan.carbonScore} kg CO₂</span>
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
                    <span className={scan.recyclable ? "text-green-600" : "text-red-600"}>
                      {scan.recyclable ? "Recyclable" : "Not Recyclable"}
                    </span>
                  </div>
                )}
              </div>

              {scan.sustainabilityBadges && scan.sustainabilityBadges.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {scan.sustainabilityBadges.map(badge => renderBadge(badge))}
                </div>
              )}
            </motion.div>
          ))}
          {history.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No scans yet. Start scanning products to build your history!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
