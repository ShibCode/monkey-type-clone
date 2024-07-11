import React, { useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import TestHistoryChart from "./TestHistoryChart";
import Spinner from "@/components/Spinner";
import Crown from "@/svg component/Crown";
import { useStats, useUser } from "@/context/User";
import { post } from "@/utils/post";
import { tableHeadings } from "./data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faChartLine,
  faEarthAmericas,
} from "@fortawesome/free-solid-svg-icons";

const TestHistory = () => {
  const [sortingCriteria, setSortingCriteria] = useState({
    field: "createdAt", // date
    order: "descending",
  });

  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const { user } = useUser();
  const { stats, setStats } = useStats();

  const updateSort = (heading) => {
    setSortingCriteria((prev) => {
      if (prev.field === heading.fieldName) {
        return {
          ...prev,
          order: prev.order === "ascending" ? "descending" : "ascending",
        };
      }

      return { field: heading.fieldName, order: "descending" };
    });
  };

  const updateTests = async (type, setLoadingState = () => {}) => {
    setLoadingState(true);

    const data = await post("/get-tests", {
      userId: user.id,
      sortingCriteria,
      totalCurrentTests: type === "LOAD" ? stats.tests.length : 0,
    });

    if (data.success) {
      setStats((prev) => ({
        ...prev,
        isMoreTests: data.isMoreTests,
        tests: type === "LOAD" ? [...prev.tests, ...data.tests] : data.tests,
      }));
    }

    setLoadingState(false);
  };

  useUpdateEffect(() => {
    const id = setTimeout(updateTests, 500);
    return () => {
      console.log("asd");
      clearTimeout(id);
    };
  }, [sortingCriteria]);

  return (
    <div className="flex flex-col">
      <table>
        <thead>
          <tr className="text-primary text-xs">
            {tableHeadings.map((heading, index) => (
              <td
                key={index}
                tooltip={heading.onHoverTooltip ? heading.onHoverTooltip : ""}
                onClick={() => {
                  if (!heading.isSortable) return;
                  updateSort(heading);
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

                {heading.isSortable && (
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className={`ml-1.5 ${
                      sortingCriteria.order === "ascending" ? "rotate-180" : ""
                    } ${
                      sortingCriteria.field === heading.fieldName
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                )}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.tests.map((test, index) => (
            <TestHistoryItem key={index} test={test} index={index} />
          ))}
        </tbody>
      </table>
      {stats.isMoreTests &&
        (isLoadingTests === false ? (
          <div
            onClick={() => updateTests("LOAD", setIsLoadingTests)}
            className="bg-bgSecondary text-tertiary hover:bg-tertiary hover:text-bgColor cursor-pointer transition-all duration-[250] grid place-items-center rounded-lg h-[40px] mt-4"
          >
            load more
          </div>
        ) : (
          <div className="mx-auto h-[40px] mt-4">
            <Spinner className={"size-8"} />
          </div>
        ))}
    </div>
  );
};

export default TestHistory;

const TestHistoryItem = ({ test, index }) => {
  const [isShowingChart, setIsShowingChart] = useState(false);

  return (
    <tr
      className={`text-tertiary ${
        index % 2 === 0 ? "bg-bgSecondary" : "bg-transparent"
      }`}
    >
      <td className="p-2 pl-4">
        {test.isPersonalBest && <Crown className="w-5" />}
      </td>
      <td className="p-2">{test.wpm}</td>
      <td className="p-2">{test.raw}</td>
      <td className="p-2">{test.accuracy}%</td>
      <td className="p-2">
        {test.correct}/{test.incorrect}/{test.extra}/{test.missed}
      </td>
      <td className="p-2">
        {test.mode.name} {test.mode.category}
      </td>
      <td className="p-2">
        <div className="flex gap-2">
          <div tooltip={test.language} className="hover-tooltip">
            <FontAwesomeIcon icon={faEarthAmericas} />
          </div>

          <button
            tooltip="View graph"
            className="hover-tooltip"
            onClick={() => setIsShowingChart(true)}
          >
            <FontAwesomeIcon icon={faChartLine} />
          </button>
        </div>

        <TestHistoryChart
          isActive={isShowingChart}
          setIsActive={setIsShowingChart}
          {...test}
        />
      </td>
      <td className="p-2 pr-4">
        <div>{test.date}</div>
        <div>{test.time}</div>
      </td>
    </tr>
  );
};
