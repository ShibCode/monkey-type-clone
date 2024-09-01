import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import getColor from "@/utils/getColor";

const BarChart = ({ wpmRange }) => {
  const chartData = {
    labels: Object.keys(wpmRange),
    datasets: [
      {
        label: "Tests",
        data: Object.keys(wpmRange).map((range) => wpmRange[range]),
        backgroundColor: getColor("secondary"),
        borderColor: getColor("secondary"),
      },
    ],
  };

  const options = {
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          color: getColor("primary"),
        },
      },
      y: {
        ticks: {
          stepSize: getStepSize,
          color: getColor("primary"),
        },
        title: {
          display: true,
          text: "Tests",
          color: getColor("primary"),
        },
      },
    },

    maintainAspectRatio: false,
  };

  function getStepSize() {
    let max = 0;

    Object.keys(wpmRange).forEach((range) => {
      if (wpmRange[range] > max) max = wpmRange[range];
    });

    while (max % 10 !== 0) max++;

    return max / 5;
  }

  return <Bar data={chartData} options={options} className="xs:p-2" />;
};

export default BarChart;
