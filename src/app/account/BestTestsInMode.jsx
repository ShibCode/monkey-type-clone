import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import BestTestsModal from "./BestTestsModal";
import dayjs from "dayjs";

const categories = {
  time: ["15", "30", "60", "120"],
  words: ["10", "25", "50", "100"],
};

const BestTestsInMode = ({ bestTests, modeName }) => {
  const [isShowingModal, setIsShowingModal] = useState(false);

  const summarised = bestTests.summarised.filter(
    (test) => test.mode.name === modeName
  );

  const detailed = bestTests.detailed.filter(
    (test) => test.mode.name === modeName
  );

  return (
    <div className="bg-bgSecondary grid grid-cols-2 gap-8 mod:gap-0 sm:grid-cols-4 py-5 mod:pl-2 pr-8 rounded-lg w-full relative">
      {categories[modeName].map((category, index) => {
        const test = summarised.find((t) => t.mode.category == category);

        return (
          <BestTest
            key={index}
            test={test}
            mode={{ name: modeName === "time" ? "seconds" : "words", category }}
          />
        );
      })}

      <button
        className="absolute text-primary right-0 top-0 bottom-0 w-8 hover:bg-tertiary hover:text-bgColor rounded-r-[inherit] transition-all text-xl"
        onClick={() => setIsShowingModal(true)}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>

      {isShowingModal && (
        <BestTestsModal
          isActive={isShowingModal}
          setIsActive={setIsShowingModal}
          tests={detailed}
          modeName={modeName}
        />
      )}
    </div>
  );
};

export default BestTestsInMode;

const BestTest = ({ test, mode }) => {
  return (
    <div className="group flex flex-col relative items-center">
      {test && (
        <div className="text-sm mod:text-[10px] lg:text-sm detailed-stats absolute w-max top-0 bottom-0 justify-between bg-bgSecondary z-10 flex flex-col items-center opacity-0 cursor-default transition-all duration-150 group-hover:opacity-100">
          <h2 className="text-primary">{test.category} seconds</h2>
          <p className="text-tertiary">{test.wpm} wpm</p>
          <p className="text-tertiary">{test.raw} raw</p>
          <p className="text-tertiary">{test.accuracy} acc</p>
          <p className="text-primary">
            {dayjs(test.createdAt).format("DD MMM YYYY")}
          </p>
        </div>
      )}

      <h2 className="text-primary text-sm mod:text-[12px] lg:text-sm">
        {mode.category} {mode.name}
      </h2>
      <p className="text-tertiary text-[36px] sm:text-[42px] mod:text-[32px] lg:text-[36px] xl:text-[42px]">
        {test ? Math.round(test.wpm) : "-"}
      </p>
      <p className="text-tertiary opacity-75 text-2xl mod:text-xl lg:text-2xl">
        {test ? Math.round(test.accuracy) + "%" : "-"}
      </p>
    </div>
  );
};
