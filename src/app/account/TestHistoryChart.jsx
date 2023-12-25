import getColor from "@/utils/getColor";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import createArray from "@/utils/createArray";
import Overlay from "@/components/Overlay";

const TestHistoryChart = ({
  isActive,
  setIsActive,
  timeTaken,
  wpmEachSecond,
  rawWpmEachSecond,
  errorsEachSecond,
}) => {
  function getStepSize() {
    const maxNormal = Math.max.apply(null, wpmEachSecond);
    const maxRaw = Math.max.apply(null, rawWpmEachSecond);

    let i = maxNormal > maxRaw ? Math.floor(maxNormal) : Math.floor(maxRaw);

    while (i % 40 !== 0) i++;

    return i / 4;
  }

  const chartData = {
    labels:
      timeTaken > Math.floor(timeTaken)
        ? [
            ...createArray(Math.floor(timeTaken)).map((_, i) => i + 1),
            +timeTaken,
          ]
        : createArray(Math.floor(timeTaken)).map((_, i) => i + 1),
    datasets: [
      {
        type: "line",
        label: "wpm",
        data: wpmEachSecond,
        backgroundColor: "#00000025",
        borderColor: () => getColor("secondary"),
        pointBackgroundColor: () => getColor("secondary"),
        fill: true,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "raw",
        data: rawWpmEachSecond,
        backgroundColor: "#00000020",
        borderColor: () => getColor("primary"),
        pointBackgroundColor: () => getColor("primary"),
        fill: true,
        yAxisID: "y",
      },
      {
        type: "scatter",
        label: "errors",
        data: errorsEachSecond,
        backgroundColor: () => getColor("error"),
        borderColor: () => getColor("error"),
        pointRadius: 3,
        pointStyle: "crossRot",
        yAxisID: "errorAxis",
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
      y: {
        beginAtZero: true,
        type: "linear",
        position: "left",
        ticks: {
          stepSize: getStepSize,
          color: getColor("primary"),
        },

        title: {
          display: true,
          text: "Words per minute",
          color: getColor("primary"),
        },
      },
      errorAxis: {
        beginAtZero: true,
        type: "linear",
        position: "right",
        ticks: {
          stepSize: 1,
          color: getColor("primary"),
        },
        title: {
          display: true,
          text: "Errors",
          color: getColor("primary"),
        },
      },
      x: {
        ticks: { color: getColor("primary") },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Overlay isActive={isActive} setIsActive={setIsActive}>
      <div
        className="bg-bgColor w-[90%] max-w-[800px] h-[300px] p-4 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Line data={chartData} options={options} />
      </div>
    </Overlay>
  );
};

export default TestHistoryChart;
