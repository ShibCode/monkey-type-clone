"use client";

import Spinner from "@/components/Spinner";
import React, { useEffect, useState } from "react";
import { tableHeadings } from "./data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { post } from "@/utils/post";
import { useUser } from "@/context/User";

const CATEGORIES = [
  "Words 10",
  "Words 25",
  "Words 50",
  "Words 100",
  "Time 15",
  "Time 30",
  "Time 60",
  "Time 120",
];

const Leaderboards = () => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [leaderboards, setLeaderboards] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const { user } = useUser();

  const fetchData = async () => {
    const response = await post("/get-leaderboards-data", {
      category: activeCategory,
    });

    if (response.success) setLeaderboards(response.leaderboardsData);
    else setActiveCategory(CATEGORIES[0]);

    setIsFetching(false);
  };

  const changeCategory = (category) => {
    setIsFetching(true);
    setActiveCategory(category);
  };

  useEffect(() => {
    const id = setTimeout(fetchData, 500);
    return () => clearInterval(id);
  }, [activeCategory]);

  return (
    <div className="wrapper my-12">
      <div className="contain flex-col gap-8">
        <div className="flex gap-2">
          {CATEGORIES.map((category, index) => (
            <button
              key={index}
              onClick={() => changeCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                category === activeCategory
                  ? "bg-tertiary text-bgSecondary"
                  : "bg-bgSecondary text-tertiary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {!isFetching && leaderboards ? (
          <table className="relative">
            <thead>
              <tr className="text-primary text-xs">
                {tableHeadings.map((heading, index) => (
                  <td
                    key={index}
                    tooltip={
                      heading.onHoverTooltip ? heading.onHoverTooltip : ""
                    }
                    className={`p-2 select-none ${index === 0 && "pl-4"} ${
                      heading.onHoverTooltip && "hover-tooltip"
                    }
      `}
                  >
                    <span>{heading.name}</span>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboards.length > 0 ? (
                leaderboards.map((test, index) => (
                  <tr
                    className={`${
                      index % 2 === 0 ? "bg-bgSecondary" : "bg-transparent"
                    } ${
                      test.userDetails._id === user.id
                        ? "text-secondary"
                        : "text-tertiary"
                    }`}
                  >
                    <td className="p-2 pl-4">
                      <div className="w-[18px] text-center">
                        {index === 0 ? (
                          <FontAwesomeIcon icon={faCrown} />
                        ) : (
                          index + 1
                        )}
                      </div>
                    </td>
                    <td className="p-2">{test.userDetails.username}</td>
                    <td className="p-2">{test.wpm}</td>
                    <td className="p-2">{test.raw}</td>
                    <td className="p-2">{test.accuracy}%</td>
                    <td className="p-2">
                      {test.correct}/{test.incorrect}/{test.extra}/{test.missed}
                    </td>
                    <td className="p-2">
                      <div>{test.date}</div>
                      <div>{test.time}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <div className="absolute w-full text-center text-tertiary my-10">
                  No data found!
                </div>
              )}
            </tbody>
          </table>
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboards;
