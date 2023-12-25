"use client";

import { post } from "@/utils/post";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faUser } from "@fortawesome/free-solid-svg-icons";
import TestHistoryItem from "./TestHistoryItem";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import _debounce from "lodash/debounce";
import BestTestsInMode from "./BestTestsInMode";
import { useStats, useUser } from "@/context/User";

const tableHeadings = [
  { name: "", isSortable: false, onHoverTooltip: false },
  { name: "wpm", isSortable: true, onHoverTooltip: false },
  { name: "raw", isSortable: true, onHoverTooltip: false },
  { name: "accuracy", isSortable: true, onHoverTooltip: false },
  {
    name: "chars",
    isSortable: false,
    onHoverTooltip: "correct/incorrect/extra/missed",
  },
  { name: "mode", isSortable: false, onHoverTooltip: false },
  { name: "info", isSortable: false, onHoverTooltip: false },
  { name: "date", isSortable: true, onHoverTooltip: false },
];

const Account = () => {
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [sortingCriteria, setSortingCriteria] = useState({
    field: "date",
    order: "descending",
  });

  const router = useRouter();

  const { user } = useUser();
  const { stats, setStats } = useStats();

  useEffect(() => {
    if (!user) router.push("/");
  }, []);

  const loadMoreTests = async () => {
    setIsLoadingTests(true);
    const { newTests, isMoreTests } = await post("/get-more-tests", {
      userId: user.id,
      totalCurrentTests: stats.tests.length,
      sortingCriteria,
    });

    setStats((prev) => ({
      ...prev,
      isMoreTests,
      tests: [...prev.tests, ...newTests],
    }));

    setIsLoadingTests(false);
  };

  const debouncedGetSortedTests = _debounce(async (heading) => {
    let newSortingCriteria = {};

    if (sortingCriteria.field === heading.name) {
      newSortingCriteria = {
        ...sortingCriteria,
        order:
          sortingCriteria.order === "ascending" ? "descending" : "ascending",
      };
    } else {
      newSortingCriteria = {
        ...sortingCriteria,
        field: heading.name,
      };
    }

    setSortingCriteria(newSortingCriteria);

    const data = await post("/get-sorted-tests", {
      userId: user.userId,
      sortingCriteria: newSortingCriteria,
    });

    if (data.success) {
      setTestsHistory(data.tests);
      setIsMoreTests(data.isMoreTests);
      setStats((prev) => ({
        ...prev,
        isMoreTests: data.isMoreTests,
        tests: data.tests,
      }));
    }
  }, 500);

  return (
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

        <div className="flex flex-col">
          <table>
            <thead>
              <tr className="text-primary text-xs">
                {tableHeadings.map((heading, index) => (
                  <td
                    key={index}
                    tooltip={
                      heading.onHoverTooltip ? heading.onHoverTooltip : ""
                    }
                    onClick={() => {
                      if (!heading.isSortable) return;
                      debouncedGetSortedTests(heading);
                    }}
                    className={`p-2 select-none
                    ${index === 0 && "pl-4"} 
                    ${index + 1 === tableHeadings.length && "pr-4"}
                    ${
                      heading.isSortable &&
                      "hover:bg-bgSecondary duration-150 cursor-pointer"
                    }
                    ${heading.onHoverTooltip && "hover-tooltip"}
                    `}
                  >
                    <span>{heading.name}</span>
                    {sortingCriteria.field === heading.name && (
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        className={`ml-1.5 ${
                          sortingCriteria.order === "ascending"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    )}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.tests.map((test, index) => (
                <TestHistoryItem key={index} {...test} index={index} />
              ))}
            </tbody>
          </table>
          {stats.isMoreTests &&
            (isLoadingTests === false ? (
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
