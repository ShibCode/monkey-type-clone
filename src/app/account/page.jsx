"use client";

import { useEffect } from "react";
import BestTestsInMode from "./BestTestsInMode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { useRouter } from "next/navigation";
import { useStats, useUser } from "@/context/User";
import TestHistory from "./TestHistory";
import { post } from "@/utils/post";
import Spinner from "@/components/Spinner";

const Account = () => {
  const router = useRouter();

  const { user } = useUser();
  const { stats, setStats } = useStats();

  useEffect(() => {
    if (!user.id) router.push("/");

    if (!stats) {
      post("/get-user-stats", { userId: user.id }).then((stats) => {
        sessionStorage.setItem("stats", JSON.stringify(stats));
        setStats(stats);
      });
    }
  }, []);

  return stats ? (
    <div className="wrapper my-12">
      <div className="contain flex-col gap-8">
        <div className="bg-bgSecondary flex items-center px-5 py-4 rounded-lg">
          <div className="flex items-center min-w-[300px] gap-4">
            <div className="bg-primary w-[80px] border-primary overflow-hidden border-t-[10px] border-r-[10px] border-l-[10px] border-b-[10px] aspect-square rounded-full grid place-items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-bgSecondary text-6xl translate-y-1"
              />
            </div>
            <div>
              <h2 className="text-tertiary text-[34px]">{user.username}</h2>

              <p className="text-primary text-xs">Joined 4 Jun 3030</p>
            </div>
          </div>

          <div className="w-2.5 rounded-xl bg-bgColor self-stretch"></div>

          <div className="flex w-full px-5">
            <div className="w-full ">
              <h2 className="text-primary text-[14px] -mb-1">test started</h2>
              <p className="text-tertiary text-3xl">
                {stats.totalTestsCompleted}
              </p>
            </div>
            <div className="w-full ">
              <h2 className="text-primary text-[14px] -mb-1">test completed</h2>
              <p className="text-tertiary text-3xl">
                {stats.totalTestsCompleted}
              </p>
            </div>
            <div className="w-full ">
              <h2 className="text-primary text-[14px] -mb-1">time typing</h2>
              <p className="text-tertiary text-3xl">{stats.timeTyping}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mod:flex-row gap-8">
          <BestTestsInMode bestTests={stats.bestTests} mode="time" />
          <BestTestsInMode bestTests={stats.bestTests} mode="words" />
        </div>

        <div className="flex flex-col gap-12">
          <div className="h-[400px] w-full">
            <LineChart
              totalTests={stats.totalTestsCompleted}
              chartData={stats.lineChartData}
            />
          </div>
          <div className="h-[200px] w-full">
            <BarChart wpmRange={stats.barChartData} />
          </div>
        </div>

        <div className="grid grid-cols-allTimeStatsLayout gap-8">
          {stats.allTimeStats.map((stat, index) => {
            return (
              <div key={index}>
                <h2 className="text-primary">{stat.name || "Test Started"}</h2>
                <p className="text-tertiary text-5xl">{stat.value || "100"}</p>
              </div>
            );
          })}
        </div>

        <TestHistory />
      </div>
    </div>
  ) : (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  );
};

export default Account;
