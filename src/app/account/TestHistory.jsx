import React, { useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import Spinner from "@/components/Spinner";
import Crown from "@/svg component/Crown";
import { useUser } from "@/context/User";
import { post } from "@/utils/post";
import { tableHeadings } from "./data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faEarthAmericas,
} from "@fortawesome/free-solid-svg-icons";

const TestHistory = ({ testHistory, setTestHistory }) => {
  const [sortingCriteria, setSortingCriteria] = useState({
    field: "createdAt", // date
    order: "descending",
  });

  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const { user } = useUser();

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

  const updateTests = async (type) => {
    if (type === "LOAD") setIsLoadingTests(true);

    const data = await post("/get-tests", {
      userId: user.id,
      sortingCriteria,
      totalCurrentTests: type === "LOAD" ? testHistory.tests.length : 0,
      type,
    });

    if (!data.success) return;

    if (type === "LOAD") {
      setTestHistory((prev) => ({
        isMoreTests: data.isMoreTests,
        tests: [...prev.tests, ...data.tests],
      }));

      setIsLoadingTests(false);
    } else {
      setTestHistory((prev) => ({ ...prev, tests: data.tests }));
    }
  };

  useUpdateEffect(() => {
    const id = setTimeout(updateTests, 200);
    return () => {
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
          {testHistory.tests.map((test, index) => (
            <TestHistoryItem key={index} test={test} index={index} />
          ))}
        </tbody>
      </table>
      {testHistory.isMoreTests &&
        (isLoadingTests === false ? (
          <div
            onClick={() => updateTests("LOAD")}
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
  return (
    <tr
      className={`text-tertiary ${
        index % 2 === 0 ? "bg-bgSecondary" : "bg-transparent"
      }`}
    >
      <td className="p-2 pl-4">
        {test.isPersonalBest && <Crown className="w-5" />}
      </td>
      <td className="p-2">{test.wpm.toFixed(2)}</td>
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
        </div>
      </td>
      <td className="p-2 pr-4">
        <div>{test.date}</div>
        <div>{test.time}</div>
      </td>
    </tr>
  );
};
