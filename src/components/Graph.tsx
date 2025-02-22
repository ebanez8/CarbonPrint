import React from "react";
import { Chart } from "react-google-charts";
import { ScanHistory as ScanHistoryType } from "../types/user";

interface GraphProps {
  history: ScanHistoryType[];
}

const Graph: React.FC<GraphProps> = ({ history }) => {
  // Transform the history data into chart data.
  // Ensure all carbon emission values are non-negative.
  const data = [
    [
      { label: "Product Number", type: "number" },
      { label: "Carbon Emission", type: "number" },
    ],
    ...history.map((scan, index) => [index + 1, Math.abs(scan.carbonScore)]), // Use Math.abs to ensure positive values
  ];

  const options = {
    legend: { position: "bottom" },
    hAxis: {
      title: "Product Number",
      format: "0",
      ticks: history.map((_, index) => index + 1).reverse(), // Reverse the ticks
      direction: -1, // Reverse the axis direction
    },
    vAxis: {
      title: "Carbon Emitted (kg)",
      viewWindowMode: "explicit", // Key change: Use explicit view window mode
      viewWindow: {
        min: 0, // Force the view to start at 0
        max: Math.max(...history.map(scan => scan.carbonScore)), // Optional: Set a dynamic max
      },
    },
  };

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
      loader={<div>Loading Chart...</div>}
    />
  );
};

export default Graph;