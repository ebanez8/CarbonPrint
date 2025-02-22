import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Bell, Zap, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanHistory as ScanHistoryType } from "../types/user";
import { ProductSustainabilityData } from "../types/product";

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
  const [rewardPoints, setRewardPoints] = useState<number>(stats.ecoPoints);
  const [chatResponse, setChatResponse] = useState<string>("");

  useEffect(() => {
    analyzeUserBehavior();
    // Update reward points based on ecoPoints and historical improvements.
    updateRewardPoints();
    generateTrendReport();
  }, [history, stats]);

  // Analyze user scanning behavior with more granularity
  const analyzeUserBehavior = async () => {
    if (history.length === 0) {
      setRecommendation("Scan some products to get personalized eco insights!");
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
  
    // impact
    const highPct = (highImpact.length / total) * 100; 
    const medPct = (mediumImpact.length / total) * 100;
    const lowPct = (lowImpact.length / total) * 100;

    let message = "";
    if (average >= 4) {
      message =
        "Your recent choices have a high carbon impact. Let's aim for greener alternatives!";
    } else if (average >= 2.5) {
      message =
        "You're making moderate choices; consider replacing some medium-impact items.";
    } else {
      message = "Excellent work! Most of your choices are eco-friendly.";
    } // else {
    //   message =
    //     "Your habits are varied. Try setting a goal to reduce high-impact scans.";
    // }
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

  // Update reward points based on ecoPoints and improvement trends
  const updateRewardPoints = () => {
    // Here we simulate a dynamic reward calculation based on ecoPoints and scan frequency.
    const bonus = history.length > 10 ? 10 : history.length;
    setRewardPoints(stats.ecoPoints + bonus);
  };

  // Generate a trend report based on historical scanning data
  const generateTrendReport = () => {
    if (history.length < 5) {
      setTrendReport("Not enough data to generate a trend report.");
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
      trendMessage = "Good news! Your carbon footprint is improving over time.";
    } else if (secondHalfAvg > firstHalfAvg) {
      trendMessage =
        "Alert: Your average carbon score is rising. Time to rethink choices.";
    } else {
      trendMessage =
        "Your eco impact remains consistent. Small improvements can be made.";
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

          {/* Trend Report and Reward Points */}
          <div className="mt-4">
            <p className="text-sm text-primary-800">
              Trend Analysis: {trendReport}
            </p>
            <p className="text-sm text-primary-800">
              Reward Points: {rewardPoints} (based on your eco actions)
            </p>
          </div>

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

          {/* Refresh Insights Button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mt-4"
            onClick={analyzeUserBehavior}
          >
            <Bell className="w-4 h-4" />
            Refresh Insights
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
