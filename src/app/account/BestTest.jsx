import React from "react";

const BestTest = ({ test, mode }) => {
  return (
    <div className="group flex flex-col relative items-center">
      <div
        className={`text-sm mod:text-[10px] lg:text-sm detailed-stats absolute w-max top-0 bottom-0 justify-between bg-bgSecondary z-10 flex flex-col items-center opacity-0 cursor-default transition-all duration-150 ${
          test.wpm && "group-hover:opacity-100"
        }`}
      >
        <h2 className="text-primary">{test.category} seconds</h2>
        <p className="text-tertiary">{test.wpm} wpm</p>
        <p className="text-tertiary">{test.raw} raw</p>
        <p className="text-tertiary">{test.accuracy} acc</p>
        <p className="text-primary">{test.date}</p>
      </div>

      <h2 className="text-primary text-sm mod:text-[12px] lg:text-sm">
        {test.category} {mode}
      </h2>
      <p className="text-tertiary text-[36px] sm:text-[42px] mod:text-[32px] lg:text-[36px] xl:text-[42px]">
        {test.wpm ? Math.round(test.wpm) : "-"}
      </p>
      <p className="text-tertiary opacity-75 text-2xl mod:text-xl lg:text-2xl">
        {test.accuracy ? Math.round(test.accuracy) + "%" : "-"}
      </p>
    </div>
  );
};

export default BestTest;
