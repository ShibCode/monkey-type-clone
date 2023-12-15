import Crown from "@/svg component/Crown";
import {
  faChartLine,
  faEarthAmericas,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import TestHistoryChart from "./TestHistoryChart";

const TestHistoryItem = (test) => {
  const [isShowingChart, setIsShowingChart] = useState(false);

  return (
    <tr
      className={`text-tertiary ${
        test.index % 2 === 0 ? "bg-bgSecondary" : "bg-transparent"
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
          isShowingChart={isShowingChart}
          setIsShowingChart={setIsShowingChart}
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

export default TestHistoryItem;
