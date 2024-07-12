import React from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import getColor from "@/utils/getColor";
import Spinner from "@/components/Spinner";

const LineChart = ({ totalTests, chartData }) => {
  const data = {
    labels: new Array(totalTests).fill(0).map((_, i) => i),
    datasets: [
      {
        type: "scatter",
        label: "Scatter Dataset",
        data: chartData ? chartData.map((test, x) => ({ x, y: test.wpm })) : [],
        backgroundColor: getColor("secondary", 0.3),
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Average of 100",
        data: chartData ? chartData.map((test) => test.averageWpmLast100) : [],
        backgroundColor: getColor("secondary"),
        borderColor: getColor("secondary"),
        pointRadius: 0,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Average of 10",
        data: chartData ? chartData.map((test) => test.averageWpmLast10) : [],
        backgroundColor: getColor("secondary", 0.3),
        borderColor: getColor("secondary", 0.3),
        pointRadius: 0,
        yAxisID: "y",
      },
      {
        type: "scatter",
        label: "Scatter Dataset",
        data: chartData
          ? chartData.map((test, x) => ({ x, y: test.accuracy }))
          : [],
        backgroundColor: getColor("primary", 0.3),
        yAxisID: "accuracyAxis",
        pointStyle: "triangle",
        pointRadius: 4,
      },
      {
        type: "line",
        label: "Average of 100",
        data: chartData ? chartData.map((test) => test.averageAccLast100) : [],
        backgroundColor: getColor("primary"),
        borderColor: getColor("primary"),
        pointRadius: 0,
        yAxisID: "accuracyAxis",
      },
      {
        type: "line",
        label: "Average of 10",
        data: chartData ? chartData.map((test) => test.averageAccLast10) : [],
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

  return (
    <>
      <div
        className={`absolute -inset-2 flex flex-col gap-2.5 justify-center items-center text-tertiary border border-primary text-lg bg-black bg-opacity-15 transition-all duration-300 ${
          chartData
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <Spinner className="fill-tertiary" />
        Fetching line chart data...
      </div>
      <Scatter data={data} options={options} />;
    </>
  );
};

export default LineChart;
