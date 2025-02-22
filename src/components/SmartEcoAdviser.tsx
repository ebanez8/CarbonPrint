import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Bell, Zap, TrendingUp, MessageSquare, ChartArea } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanHistory as ScanHistoryType } from "../types/user";
import { ProductSustainabilityData } from "../types/product";
import Graph from "@/components/Graph"; // Match the filename



import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SmartEcoAdvisorProps {
  history: ScanHistoryType[];
  stats: {
    totalScans: number;
    ecoPoints: number;
    carbonSaved: number;
  };
  onSuggestAlternative: (
    barcode: string
  ) => Promise<ProductSustainabilityData | null>;
  // Stub function to simulate chat-based responses from an NLP API
  onChatQuery?: (query: string) => Promise<string>;
}

export const SmartEcoAdvisor: React.FC<SmartEcoAdvisorProps> = ({
  history,
  stats,
  onSuggestAlternative,
  onChatQuery,
}) => {
  // State for main recommendation, challenge, and alternative suggestion.
  const [recommendation, setRecommendation] = useState<string>("");
  const [challenge, setChallenge] = useState<string>("");
  const [alternativeProduct, setAlternativeProduct] =
    useState<ProductSustainabilityData | null>(null);

  // Additional states for trend analysis and gamification.
  const [trendReport, setTrendReport] = useState<string>("");
  const [chatResponse, setChatResponse] = useState<string>("");

  useEffect(() => {
    analyzeUserBehavior();
    // Update reward points based on ecoPoints and historical improvements.
    generateTrendReport();
  }, [history, stats]);

  // Analyze user scanning behavior with more granularity
  const analyzeUserBehavior = async () => {
    if (history.length === 0) {
      setRecommendation("Scan products to get personalized eco-insights!");
      return;
    }

    // Partition scans into impact levels
    const highImpact = history.filter((scan) => scan.carbonScore >= 5);
    const mediumImpact = history.filter(
      (scan) => scan.carbonScore >= 2.5 && scan.carbonScore < 5
    );
    const lowImpact = history.filter((scan) => scan.carbonScore < 2.5);

    // Calculate percentages for analysis
    const totalCarbon = history.reduce((sum, scan) => sum + scan.carbonScore, 0);
    const total = history.length;
    const average = totalCarbon / total;

    let message = "";
    if (average >= 4) {
      message =
        "Your recent choices have a high carbon impact. Let's aim for greener alternatives!";
    } else if (average >= 2.5) {
      message =
        "You're making moderately eco-friendly choices; consider replacing some medium-impact items with more eco-friendly ones.";
    } else {
      message = "Excellent work! Most of your choices are eco-friendly.";
    } 
    setRecommendation(message);

    generateChallenge(highImpact.length, mediumImpact.length);

    // Suggest an alternative based on the most frequently scanned high-impact product
    if (highImpact.length > 0) {
      const mostFrequent = highImpact.reduce((prev, curr) =>
        history.filter((scan) => scan.barcode === prev.barcode).length >
        history.filter((scan) => scan.barcode === curr.barcode).length
          ? prev
          : curr
      );
      const alternative = await onSuggestAlternative(mostFrequent.barcode);
      setAlternativeProduct(alternative);
    } else {
      setAlternativeProduct(null);
    }
  };

  // Generate a challenge based on the count of high/medium impact scans
  const generateChallenge = (highCount: number, mediumCount: number) => {
    if (highCount > 3) {
      setChallenge("Challenge: Reduce high-impact purchases by 25% this week!");
    } else if (mediumCount > 4) {
      setChallenge(
        "Challenge: Swap 3 medium-impact products for greener options!"
      );
    } else {
      setChallenge("Great progress! Explore new sustainable brands this week.");
    }
  };


  // Generate a trend report based on historical scanning data
  const generateTrendReport = () => {
    if (history.length < 5) {
      setTrendReport("Keep on scanning to view a complete trend report!");
      return;
    }
    // A basic trend analysis: compare average scores in the first half vs. the second half of history.
    const halfIndex = Math.floor(history.length / 2);
    const firstHalfAvg =
      history
        .slice(halfIndex)
        .reduce((sum, scan) => sum + scan.carbonScore, 0) /
      (history.length - halfIndex);
    const secondHalfAvg =
      history
        .slice(0, halfIndex)
        .reduce((sum, scan) => sum + scan.carbonScore, 0) / halfIndex;

    let trendMessage = "";
    if (secondHalfAvg < firstHalfAvg) {
      trendMessage = "Good news! Your carbon footprint is improving over time. Keep it up!";
    } else if (secondHalfAvg > firstHalfAvg) {
      trendMessage =
        "Alert: Your average carbon score is rising. Time to rethink your purchase choices!";
    } else {
      trendMessage =
        "Your eco-impact remains consistent. Remember, small improvements are better than none!";
    }
    setTrendReport(trendMessage);
  };

  // A stub for chat integration using an NLP API to answer user questions
  const handleChatQuery = async (query: string) => {
    if (!onChatQuery) return;
    try {
      const response = await onChatQuery(query);
      setChatResponse(response);
    } catch (error) {
      setChatResponse("Sorry, I couldn't process your query at the moment.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-primary-50 border-primary-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-700">
            <Bot className="w-5 h-5" />
            Smart Eco-Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Recommendation */}
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-500 mt-1" />
            <p className="text-primary-800">{recommendation}</p>
          </div>

          {/* Personalized Challenge */}
          {challenge && (
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
              <p className="text-green-700 font-medium">{challenge}</p>
            </div>
          )}

          {/* Alternative Product Suggestion */}
          {alternativeProduct && (
            <div className="mt-4">
              <h4 className="font-medium text-primary-700 mb-2">
                Suggested Eco-Alternative:
              </h4>
              <p className="text-sm text-gray-600">
                {alternativeProduct.name} - Carbon Score:{" "}
                {alternativeProduct.carbonScore.value}
              </p>
            </div>
          )}

          { /* View Trend Analysis in Graph */ }
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="w-full gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                size="lg"
              >
                <ChartArea className="w-5 h-5" />
                View Trend Analysis
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Trend Analysis: Carbon Footprint Over Time
                </DialogTitle>
              </DialogHeader>
              {/* Trend Report and Reward Points */}
              <div className="mt-4">
                <p className="text-sm text-primary-800">
                  Trend Analysis: {trendReport}
                </p>
              </div>
              
              <Graph history={history} /> 
            </DialogContent>
          </Dialog>

          {/* Chat Query Section (if chat integration is provided) */}
          {onChatQuery && (
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() =>
                  handleChatQuery("How can I lower my carbon footprint?")
                }
              >
                <MessageSquare className="w-4 h-4" />
                Ask Eco-Advisor
              </Button>
              {chatResponse && (
                <p className="mt-2 text-sm text-gray-700">{chatResponse}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
