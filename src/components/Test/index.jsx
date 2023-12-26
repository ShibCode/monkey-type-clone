import { useEffect, useRef, useState } from "react";
import Controls from "./Controls";
import TestArea from "./TestArea";
import Result from "./Result";
import { useTestStarted } from "@/context/TestStarted";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const TEST_RESTART_ANIMATION_DURATION = 100;

const Test = () => {
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

  const [isCompleted, setIsCompleted] = useState(false);

  const [seed, setSeed] = useState(1);
  const [menuSeed, setMenuSeed] = useState(1);

  const { setTestStarted } = useTestStarted();

  const restartBtn = useRef(null);

  const restart = () => {
    setWpmEachSecond([]);
    setRawWpmEachSecond([]);
    setErrorsEachSecond([]);
    setResult({});
    setIsCompleted(false);
    setTestStarted(false);
  };

  useEffect(() => {
    if (restartBtn.current) {
      restartBtn.current.disabled = true;

      setTimeout(() => {
        restartBtn.current.disabled = false;
      }, TEST_RESTART_ANIMATION_DURATION);
    }
  }, []);

  const duringTestRestart = () => {
    restartBtn.current.disabled = true;

    const testSection = document.querySelector("#testSection");
    testSection.style.opacity = 0;

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

  return (
    <div className="wrapper" id="wrapper">
      <div className="contain py-12">
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
            <Controls
              changeMode={changeMode}
              updateTotalWords={updateTotalWords}
              updateTotalTime={updateTotalTime}
              totalWords={totalWords}
              totalTime={totalTime}
              mode={mode}
            />

            <div
              id="testSection"
              style={{
                transitionDuration: `${TEST_RESTART_ANIMATION_DURATION}ms`,
              }}
              className="transition-all ease-linear py-16 animate-fadeIn"
            >
              <TestArea
                key={seed}
                setResult={setResult}
                setIsCompleted={setIsCompleted}
                setWpmEachSecond={setWpmEachSecond}
                setRawWpmEachSecond={setRawWpmEachSecond}
                setErrorsEachSecond={setErrorsEachSecond}
                mode={mode}
                totalWords={totalWords}
                totalTime={totalTime}
                duringTestRestart={duringTestRestart}
              />

              <button
                ref={restartBtn}
                onClick={duringTestRestart}
                disabled={isCompleted}
                id="restartBtn"
                className="text-primary hover:text-tertiary text-xl transition-all cursor-pointer w-20 h-14 grid place-items-center rounded-lg focus:text-bgColor focus:bg-tertiary focus:outline-none mx-auto mt-5"
              >
                <FontAwesomeIcon icon={faRotateRight} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
