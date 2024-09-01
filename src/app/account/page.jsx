"use client";

import { useEffect, useState } from "react";
import BestTestsInMode from "./BestTestsInMode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/User";
import TestHistory from "./TestHistory";
import { post } from "@/utils/post";
import Spinner from "@/components/Spinner";
import { formatTime } from "@/utils/formatTime";

const allTimeStatsLayout = [
  "tests started",
  "tests completed",
  "time typing",
  "highest wpm",
  "avg wpm",
  "avg wpm (last 10 tests)",
  "highest raw wpm",
  "avg raw wpm",
  "avg raw wpm (last 10 tests)",
  "highest accuracy",
  "avg accuracy",
  "avg accuracy (last 10 tests)",
];

const Account = () => {
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [bestTests, setBestTests] = useState(null);
  const [allTimeStats, setAllTimeStats] = useState(null);
  const [testHistory, setTestHistory] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    const stats = false;
    if (!stats) {
      post("/get-user-stats", { userId: user._id }).then((stats) => {
        setBarChartData(stats.barChartData);
        setBestTests(stats.bestTests);
        setAllTimeStats(stats.allTimeStats);
        setTestHistory({ isMoreTests: stats.isMoreTests, tests: stats.tests });
      });
    }

    post("/get-line-chart-data", { userId: user._id }).then((data) => {
      setLineChartData(data);
    });
  }, []);

  return testHistory && user ? (
    <div className="wrapper my-12 flex-grow">
      <div className="contain flex-col gap-8">
        <div className="bg-bgSecondary flex flex-col md:flex-row md:items-center px-5 py-4 rounded-lg gap-y-2">
          <div className="flex items-center xs:min-w-[300px] gap-4">
            <div className="bg-primary min-w-[64px] w-[64px] xs:w-[80px] border-primary overflow-hidden border-[6.5px] xs:border-[10px] aspect-square rounded-full grid place-items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-bgSecondary text-5xl xs:text-6xl translate-y-1"
              />
            </div>
            <div className="flex flex-col gap-1 overflow-hidden text-[30px] xs:text-[34px]">
              <h2
                style={{
                  fontSize: `min(${260 / user.username.length}px, 1em)`,
                }}
                className="text-tertiary leading-[1] overflow-hidden text-ellipsis"
              >
                {user.username}
              </h2>

              <p className="text-primary text-xs">Joined {user.createdAt}</p>
            </div>
          </div>

          <div className="w-2.5 rounded-xl bg-bgColor self-stretch"></div>

          <div className="flex flex-wrap md:flex-nowrap md:flex-col mod:flex-row w-full px-1.5 md:px-5 gap-y-2 gap-x-8 md:gap-x-0">
            <div className="min-w-max flex-grow">
              <h2 className="text-primary text-[14px] -mb-1">tests started</h2>
              <p className="text-tertiary text-3xl">
                {allTimeStats["tests started"]}
              </p>
            </div>
            <div className="min-w-max flex-grow">
              <h2 className="text-primary text-[14px] -mb-1">
                tests completed
              </h2>
              <p className="text-tertiary text-3xl">
                {allTimeStats["tests completed"]}
              </p>
            </div>
            <div className="min-w-max flex-grow">
              <h2 className="text-primary text-[14px] -mb-1">time typing</h2>
              <p className="text-tertiary text-3xl">
                {formatTime(allTimeStats["time typing"])}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mod:flex-row gap-8">
          <BestTestsInMode bestTests={bestTests} modeName="time" />
          <BestTestsInMode bestTests={bestTests} modeName="words" />
        </div>

        {testHistory.tests.length > 0 ? (
          <>
            <div className="flex flex-col gap-12">
              <div className="h-[420px] w-full relative">
                <LineChart
                  totalTests={allTimeStats["tests completed"]}
                  chartData={lineChartData}
                />
              </div>
              <div className="h-[220px] w-full">
                <BarChart wpmRange={barChartData} />
              </div>
            </div>

            <div className="grid grid-cols-allTimeStatsLayout gap-8">
              {allTimeStatsLayout.map((key, index) => {
                return (
                  <div key={index}>
                    <h2 className="text-primary">{key}</h2>
                    <p className="text-tertiary text-5xl">
                      {key === "time typing"
                        ? formatTime(allTimeStats[key])
                        : allTimeStats[key]}
                    </p>
                  </div>
                );
              })}
            </div>

            <TestHistory
              testHistory={testHistory}
              setTestHistory={setTestHistory}
            />
          </>
        ) : (
          <div className="text-xl text-tertiary text-center flex-1 flex items-center justify-center flex-grow">
            No Data Found
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  );
};

export default Account;
