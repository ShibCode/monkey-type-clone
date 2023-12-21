import { useTestStarted } from "@/context/TestStarted";
import React from "react";

const Controls = ({
  changeMode,
  updateTotalWords,
  updateTotalTime,
  totalWords,
  totalTime,
  mode,
}) => {
  const { testStarted } = useTestStarted();

  return (
    <div
      className={`flex text-[14px] gap-4 self-center transition-all duration-150 bg-bgSecondary rounded-lg px-4 py-2.5 ${
        testStarted ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex gap-4">
        <button
          onClick={() => changeMode("time")}
          className={`text-primary cursor-pointer ${
            mode === "time" && "text-secondary"
          }`}
        >
          time
        </button>
        <button
          onClick={() => changeMode("words")}
          className={`text-primary cursor-pointer ${
            mode === "words" && "text-secondary"
          }`}
        >
          words
        </button>
      </div>

      <div className="bg-bgColor self-stretch w-1"></div>

      <div className="flex gap-4">
        <button
          onClick={() =>
            mode === "words" ? updateTotalWords(10) : updateTotalTime(15)
          }
          className={`text-primary cursor-pointer ${
            mode === "words"
              ? totalWords === 10 && "text-secondary"
              : totalTime === 15 && "text-secondary"
          }`}
        >
          {mode === "words" ? 10 : 15}
        </button>
        <button
          onClick={() =>
            mode === "words" ? updateTotalWords(25) : updateTotalTime(30)
          }
          className={`text-primary cursor-pointer ${
            mode === "words"
              ? totalWords === 25 && "text-secondary"
              : totalTime === 30 && "text-secondary"
          }`}
        >
          {mode === "words" ? 25 : 30}
        </button>
        <button
          onClick={() =>
            mode === "words" ? updateTotalWords(50) : updateTotalTime(60)
          }
          className={`text-primary cursor-pointer ${
            mode === "words"
              ? totalWords === 50 && "text-secondary"
              : totalTime === 60 && "text-secondary"
          }`}
        >
          {mode === "words" ? 50 : 60}
        </button>
        <button
          onClick={() =>
            mode === "words" ? updateTotalWords(100) : updateTotalTime(120)
          }
          className={`text-primary cursor-pointer ${
            mode === "words"
              ? totalWords === 100 && "text-secondary"
              : totalTime === 120 && "text-secondary"
          }`}
        >
          {mode === "words" ? 100 : 120}
        </button>
      </div>
    </div>
  );
};

export default Controls;
