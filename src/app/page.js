"use client";

import LoadingPage from "@/components/LoadingPage";
import Result from "@/components/Result";
import Test from "@/components/Test";
import { useContext, useEffect, useState } from "react";
import onLoad from "@/utils/onLoad";
import { TestStartedContext } from "@/context/TestStarted";

const TEST_RESTART_ANIMATION_DURATION = 130;

const Home = () => {
  const [mode, setMode] = useState("words");
  const [totalWords, setTotalWords] = useState(10);
  const [totalTime, setTotalTime] = useState(15);

  const [result, setResult] = useState({
    correct: 0,
    extra: 0,
    incorrect: 0,
    missed: 0,
    timeTaken: 0,
  });

  const [wpmEachSecond, setWpmEachSecond] = useState([]);
  const [rawWpmEachSecond, setRawWpmEachSecond] = useState([]);
  const [errorsEachSecond, setErrorsEachSecond] = useState([]);
  useEffect(() => {
    console.log(errorsEachSecond);
  }, [errorsEachSecond]);
  const [isCompleted, setIsCompleted] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [colorsLoaded, setColorsLoaded] = useState(false);

  const { testStarted, setTestStarted } = useContext(TestStartedContext);

  const [seed, setSeed] = useState(1);
  const [menuSeed, setMenuSeed] = useState(1);

  const restart = () => {
    setWpmEachSecond([]);
    setRawWpmEachSecond([]);
    setErrorsEachSecond([]);
    setResult({});
    setIsCompleted(false);
  };

  const duringTestRestart = () => {
    const testSection = document.querySelector("#testSection");

    testSection.style.opacity = 0;

    setTimeout(() => {
      testSection.style.opacity = 1;
    }, TEST_RESTART_ANIMATION_DURATION + 10);

    setTimeout(() => {
      setSeed(Math.random());
      setMenuSeed(Math.random());
      setWpmEachSecond([]);
      setRawWpmEachSecond([]);
      setErrorsEachSecond([]);
      setResult({});
      setTestStarted(false);
      setIsCompleted(false);
    }, TEST_RESTART_ANIMATION_DURATION);
  };

  useEffect(() => {
    onLoad(setColorsLoaded);
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  const changeMode = (mode) => {
    setMode(mode);
    duringTestRestart();
  };

  const updateTotalWords = (totalWords) => {
    setTotalWords(totalWords);
    duringTestRestart();
  };

  const updateTotalTime = (totalTime) => {
    setTotalTime(totalTime);
    duringTestRestart();
  };

  return isLoaded ? (
    <div className="wrapper" id="wrapper">
      <div className="contain py-16">
        {result.timeTaken ? (
          <Result
            result={result}
            wpmEachSecond={wpmEachSecond}
            rawWpmEachSecond={rawWpmEachSecond}
            errorsEachSecond={errorsEachSecond}
            mode={mode}
            modeCategory={mode === "words" ? totalWords : totalTime}
            restart={restart}
          />
        ) : (
          <div
            key={menuSeed}
            className={`flex flex-col gap-8 w-full transition-all duration-150 ${
              isCompleted && "opacity-0"
            }`}
          >
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
                    mode === "words"
                      ? updateTotalWords(10)
                      : updateTotalTime(15)
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
                    mode === "words"
                      ? updateTotalWords(25)
                      : updateTotalTime(30)
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
                    mode === "words"
                      ? updateTotalWords(50)
                      : updateTotalTime(60)
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
                    mode === "words"
                      ? updateTotalWords(100)
                      : updateTotalTime(120)
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

            <div
              id="testSection"
              className={`transition-all duration-${TEST_RESTART_ANIMATION_DURATION} py-16`}
            >
              <Test
                key={seed}
                setResult={setResult}
                isCompleted={isCompleted}
                setIsCompleted={setIsCompleted}
                setWpmEachSecond={setWpmEachSecond}
                setRawWpmEachSecond={setRawWpmEachSecond}
                setErrorsEachSecond={setErrorsEachSecond}
                mode={mode}
                totalWords={totalWords}
                totalTime={totalTime}
                restart={duringTestRestart}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <LoadingPage colorsLoaded={colorsLoaded} />
  );
};

export default Home;
