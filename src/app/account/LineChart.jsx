import React, { useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import getColor from "@/utils/getColor";

const LineChart = ({ totalTests, chartData }) => {
  const data = {
    labels: new Array(totalTests).fill(0).map((_, i) => i),
    datasets: [
      {
        type: "scatter",
        label: "Scatter Dataset",
        data: chartData.scatterWPM,
        backgroundColor: getColor("secondary", 0.3),
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Average of 100",
        data: chartData.averageOf100WPM,
        backgroundColor: getColor("secondary"),
        borderColor: getColor("secondary"),
        pointRadius: 0,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Average of 10",
        data: chartData.averageOf10WPM,
        backgroundColor: getColor("secondary", 0.3),
        borderColor: getColor("secondary", 0.3),
        pointRadius: 0,
        yAxisID: "y",
      },
      {
        type: "scatter",
        label: "Scatter Dataset",
        data: chartData.scatterAcc,
        backgroundColor: getColor("primary", 0.3),
        yAxisID: "accuracyAxis",
        pointStyle: "triangle",
        pointRadius: 4,
      },
      {
        type: "line",
        label: "Average of 100",
        data: chartData.averageOf100Acc,
        backgroundColor: getColor("primary"),
        borderColor: getColor("primary"),
        pointRadius: 0,
        yAxisID: "accuracyAxis",
      },
      {
        type: "line",
        label: "Average of 10",
        data: chartData.averageOf10Acc,
        backgroundColor: getColor("primary", 0.3),
        borderColor: getColor("primary", 0.3),
        pointRadius: 0,
        yAxisID: "accuracyAxis",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        ticks: { stepSize: 1 },
      },
      y: {
        position: "right",
        ticks: {
          color: getColor("primary"),
          stepSize: 10,
        },

        title: {
          display: true,
          text: "Words per minute",
          color: getColor("primary"),
        },
      },
      accuracyAxis: {
        position: "left",
        display: true,
        ticks: { color: getColor("primary") },
        min: 0,
        max: 100,
        stepSize: 10,
        reverse: true,
        title: {
          display: true,
          text: "Accuracy",
          color: getColor("primary"),
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return <Scatter data={data} options={options} />;
};

export default LineChart;
