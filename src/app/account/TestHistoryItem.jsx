import React from "react";

const TestHistoryItem = (test) => {
  return (
    <div
      className={`text-tertiary flex w-full h-[56px] items-center text-center font-medium rounded-lg ${
        test.index % 2 === 0 ? "bg-bgSecondary" : "bg-transparent"
      }`}
    >
      <div className="w-[15%]">{test.wpm}</div>
      <div className="w-[15%]">{test.raw}</div>
      <div className="w-[15%]">{test.accuracy}%</div>
      <div className="w-[19%]">
        {test.correct}/{test.incorrect}/{test.extra}/{test.missed}
      </div>
      <div className="w-[18%]">
        {test.mode.name} {test.mode.category}
      </div>
      <div className="flex flex-col w-[18%] items-center">
        <div className="w-max text-start">
          <div>{test.date}</div>
          <div>{test.time}</div>
        </div>
      </div>
    </div>
  );
};

export default TestHistoryItem;
