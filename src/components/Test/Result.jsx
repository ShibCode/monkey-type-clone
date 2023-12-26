import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import calculateWpm from "@/utils/calulateWpm";
import { post } from "@/utils/post";
import getColor from "@/utils/getColor";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Crown from "@/svg component/Crown";
import { AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/Settings";
import { useStats, useUser } from "@/context/User";

const Result = ({
  result,
  wpmEachSecond,
  rawWpmEachSecond,
  errorsEachSecond,
  mode,
  modeCategory,
  restart,
}) => {
  const { user } = useUser();
  const { setStats } = useStats();
  const { getSettingValue } = useSettings();

  const language = getSettingValue("language").replace(/_/g, " ");

  const { correct, incorrect, missed, extra, timeTaken } = result;

  const stats = {
    wpm: calculateWpm(correct, timeTaken),
    raw: calculateWpm(correct + incorrect, timeTaken),
    accuracy: parseFloat(
      (correct / (incorrect + missed + correct + extra)) * 100
    ).toFixed(2),
  };

  const testData = {
    ...stats,
    ...result,
    mode: {
      name: mode,
      category: modeCategory,
    },
  };

  const [tabIndex, setTabIndex] = useState(0);
  const [isPersonalBest, setIsPersonalBest] = useState(false);

  const chartData = {
    labels:
      timeTaken > Math.floor(timeTaken)
        ? [...wpmEachSecond.map((_, i) => i + 1), +timeTaken]
        : wpmEachSecond.map((_, i) => i + 1),
    datasets: [
      {
        type: "line",
        label: "wpm",
        data: [...wpmEachSecond, stats.wpm],
        backgroundColor: "#00000025",
        borderColor: () => getColor("secondary"),
        pointBackgroundColor: () => getColor("secondary"),
        fill: true,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "raw",
        data: [...rawWpmEachSecond, stats.raw],
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

  function getStepSize() {
    const maxNormal = Math.max.apply(null, wpmEachSecond);
    const maxRaw = Math.max.apply(null, rawWpmEachSecond);

    let i = maxNormal > maxRaw ? Math.floor(maxNormal) : Math.floor(maxRaw);

    while (i % 40 !== 0) i++;

    return i / 4;
  }

  async function saveTest(testData) {
    const res = await post("/save-test", { userId: user.id, testData });
    return res;
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();

      setTabIndex((tabIndex) => {
        const tabBtns = document.querySelectorAll("#tabBtns > *");

        [...tabBtns][tabIndex].focus();

        return tabIndex === tabBtns.length - 1 ? 0 : tabIndex + 1;
      });
    }
  }

  useEffect(() => {
    if (user.id)
      saveTest({
        ...testData,
        wpmEachSecond: [...wpmEachSecond, testData.wpm],
        rawWpmEachSecond: [...rawWpmEachSecond, testData.raw],
        errorsEachSecond,
        language,
      }).then((res) => {
        if (!res.success) return;
        if (res.test.isPersonalBest) setIsPersonalBest(true);
        setStats((prev) => {
          prev.tests.unshift(res.test);
          prev.tests.pop();

          return prev;
        });
      });

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="absolute inset-0 z-10 mt-[55px] bg-bgColor wrapper">
      <div className="contain flex-col justify-center gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex w-full gap-4">
            <div className="min-w-[250px]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-primary text-3xl">wpm</h2>
                  <AnimatePresence>
                    {isPersonalBest && (
                      <div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-bgSecondary bg-secondary w-7 h-7 grid place-items-center rounded-lg"
                      >
                        <Crown className={"max-w-[16px]"} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-secondary text-6xl">{stats.wpm}</p>
              </div>

              <div>
                <h2 className="text-primary text-3xl">acc</h2>
                <p className="text-secondary text-6xl">{stats.accuracy}%</p>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <Line data={chartData} options={options} />
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <h2 className="text-primary">test type</h2>
              <p className="text-secondary">
                {mode} {modeCategory}
              </p>
              <p className="text-secondary leading-[100%]">{language}</p>
            </div>
            <div>
              <h2 className="text-primary">raw</h2>
              <p className="text-secondary text-3xl">{stats.raw}</p>
            </div>
            <div>
              <h2 className="text-primary">character</h2>
              <p className="text-secondary text-3xl">
                {correct}/{incorrect}/{extra}/{missed}
              </p>
            </div>
            <div>
              <h2 className="text-primary">time</h2>
              <p className="text-secondary text-3xl">{timeTaken}s</p>
            </div>
          </div>
        </div>

        {Object.keys(user).length === 0 && (
          <p className="text-primary text-center text-lg cursor-default">
            <Link
              href="/login"
              className="underline cursor-pointer hover:text-tertiary transition"
            >
              Sign in
            </Link>{" "}
            to save your result
          </p>
        )}

        <div id="tabBtns" className="flex justify-center">
          <button
            onClick={restart}
            className="text-primary hover:text-tertiary text-xl transition cursor-pointer w-20 h-14 grid place-items-center rounded-lg focus:text-bgColor focus:bg-tertiary focus:outline-none"
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
