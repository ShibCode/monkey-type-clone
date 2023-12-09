"use client";

import { post } from "@/utils/post";
import { redirect } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import TestHistoryItem from "./TestHistoryItem";
import onLoad from "@/utils/onLoad";
import LoadingPage from "@/components/LoadingPage";
import Chart2 from "./Chart2";
import Chart1 from "./Chart1";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

const Account = () => {
  const [user, setUser] = useState({});
  const [detailedStats, setDetailedStats] = useState([]);
  const [testSpeedRange, setTestSpeedRange] = useState({});
  const [chartData, setChartData] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);
  const [colorsLoaded, setColorsLoaded] = useState(false);

  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const router = useRouter();

  useEffect(() => {
    onLoad(setColorsLoaded);

    const user = JSON.parse(localStorage.getItem("monkey-type-clone-user"));

    if (!user) router.push("/");
    else {
      const { email } = user;
      post("/get-user-data", { email }).then(
        ({ user, testSpeedRange, detailedStats, chartData }) => {
          setUser(user);
          setDetailedStats(detailedStats);
          setTestSpeedRange(testSpeedRange);
          setChartData(chartData);

          setIsLoaded(true);
        }
      );
    }
  }, []);

  const loadMoreTests = async () => {
    setIsLoadingTests(true);
    const { testHistory } = await post("/get-more-tests", {
      _id: user._id,
      totalCurrentTests: user.testHistory.length,
    });

    setUser((prev) => ({ ...prev, testHistory }));
    setIsLoadingTests(false);
  };

  return isLoaded ? (
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
                {user.totalTestsCompleted}
              </p>
            </div>
            <div className="w-full ">
              <h2 className="text-primary text-[14px] -mb-1">test completed</h2>
              <p className="text-tertiary text-3xl">
                {user.totalTestsCompleted}
              </p>
            </div>
            <div className="w-full ">
              <h2 className="text-primary text-[14px] -mb-1">time typing</h2>
              <p className="text-tertiary text-3xl">{user.timeTyping}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mod:flex-row gap-8">
          <div className="bg-bgSecondary grid grid-cols-2 gap-8 mod:gap-0 sm:grid-cols-4 py-5 mod:px-2 rounded-lg w-full">
            {Object.keys(user.bestTests.time).map((modeName, index) => {
              const test = user.bestTests.time[modeName];
              return (
                <div
                  className="best-test flex flex-col relative items-center "
                  key={index}
                >
                  <div
                    className={`text-sm mod:text-[10px] lg:text-sm detailed-stats absolute w-max top-0 bottom-0 justify-between bg-bgSecondary z-10 flex flex-col items-center opacity-0 cursor-default transition-all duration-150 ${
                      test.wpm && "hover:opacity-100"
                    }`}
                  >
                    <h2 className="text-primary">
                      {test.mode.category} seconds
                    </h2>
                    <p className="text-tertiary">{test.wpm} wpm</p>
                    <p className="text-tertiary">{test.raw} raw</p>
                    <p className="text-tertiary">{test.accuracy} acc</p>
                    <p className="text-primary">{test.date}</p>
                  </div>

                  <h2 className="text-primary text-sm mod:text-[12px] lg:text-sm">
                    {test.mode.category} seconds
                  </h2>
                  <p className="text-tertiary text-[36px] sm:text-[42px] mod:text-[32px] lg:text-[36px] xl:text-[42px]">
                    {test.wpm ? Math.round(test.wpm) : "-"}
                  </p>
                  <p className="text-tertiary opacity-75 text-2xl mod:text-xl lg:text-2xl">
                    {test.accuracy ? Math.round(test.accuracy) + "%" : "-"}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="bg-bgSecondary grid grid-cols-2 gap-8 mod:gap-0 sm:grid-cols-4 py-5 mod:px-2 rounded-lg w-full">
            {Object.keys(user.bestTests.words).map((modeName, index) => {
              const test = user.bestTests.words[modeName];

              return (
                <div
                  className="best-test flex flex-col relative items-center"
                  key={index}
                >
                  <div className="text-sm mod:text-[10px] lg:text-sm detailed-stats absolute w-max top-0 bottom-0 justify-between bg-bgSecondary z-10 flex flex-col items-center opacity-0 cursor-default transition-all duration-150 hover:opacity-100">
                    <h2 className="text-primary">{test.mode.category} words</h2>
                    <p className="text-tertiary">{test.wpm} wpm</p>
                    <p className="text-tertiary">{test.raw} raw</p>
                    <p className="text-tertiary">{test.accuracy} acc</p>
                    <p className="text-primary">{test.date}</p>
                  </div>

                  <h2 className="text-primary text-sm mod:text-[12px] lg:text-sm">
                    {test.mode.category} words
                  </h2>
                  <p className="text-tertiary text-[36px] sm:text-[42px] mod:text-[32px] lg:text-[36px] xl:text-[42px]">
                    {test.wpm ? Math.round(test.wpm) : "-"}
                  </p>
                  <p className="text-tertiary opacity-75 text-2xl mod:text-xl lg:text-2xl">
                    {test.accuracy ? Math.round(test.accuracy) + "%" : "-"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-12">
          <div className="h-[400px] w-full">
            <Chart1
              totalTests={user.totalTestsCompleted}
              chartData={chartData}
            />
          </div>
          <div className="h-[200px] w-full">
            <Chart2 wpmRange={testSpeedRange} />
          </div>
        </div>

        <div className="grid grid-cols-detailedStatsLayout gap-8">
          {detailedStats.map((stat, index) => {
            return (
              <div key={index}>
                <h2 className="text-primary">{stat.name || "Test Started"}</h2>
                <p className="text-tertiary text-5xl">{stat.value || "100"}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col w-full">
          <div className="text-primary flex w-full h-[44px] items-center text-center text-xs rounded-lg -mb-2">
            <div className="w-[15%]">wpm</div>
            <div className="w-[15%]">raw</div>
            <div className="w-[15%]">accuracy</div>
            <div className="w-[19%]">chars</div>
            <div className="w-[18%]">mode</div>
            <div className="flex flex-col w-[18%]">date</div>
          </div>
          {user.testHistory?.map((test, index) => {
            return <TestHistoryItem key={index} {...test} index={index} />;
          })}

          {isLoadingTests === false ? (
            <div
              onClick={loadMoreTests}
              className="bg-bgSecondary text-tertiary hover:bg-tertiary hover:text-bgColor cursor-pointer transition-all duration-[250] grid place-items-center rounded-lg h-[40px] mt-4"
            >
              load more
            </div>
          ) : (
            <div className="mx-auto h-[40px] mt-4">
              <Spinner fill="fill-bgSecondary" />
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <LoadingPage colorsLoaded={colorsLoaded} />
  );
};

export default Account;
