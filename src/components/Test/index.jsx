import { useEffect, useRef, useState } from "react";
import Controls from "./Controls";
import TestArea from "./TestArea";
import Result from "./Result";
import { useTestStarted } from "@/context/TestStarted";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const TEST_RESTART_DURATION = 100;

export const MODES = {
  words: [10, 25, 50, 100],
  time: [15, 30, 60, 120],
};

const Test = () => {
  const [mode, setMode] = useState({ name: "words", category: 10 });

  const [result, setResult] = useState(null);

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
    setResult(null);
    setIsCompleted(false);
    setTestStarted(false);
  };

  useEffect(() => {
    if (restartBtn.current) {
      restartBtn.current.disabled = true;

      setTimeout(() => {
        restartBtn.current.disabled = false;
      }, TEST_RESTART_DURATION);
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
      setResult(null);
      setTestStarted(false);
      setIsCompleted(false);
    }, TEST_RESTART_DURATION);
  };

  const changeMode = (name, category) => {
    setMode({ name, category });
    duringTestRestart();
  };

  return (
    <div className="wrapper" id="wrapper">
      <div className="contain py-12">
        {result ? (
          <Result
            result={result}
            wpmEachSecond={wpmEachSecond}
            rawWpmEachSecond={rawWpmEachSecond}
            errorsEachSecond={errorsEachSecond}
            mode={mode}
            restart={restart}
          />
        ) : (
          <div
            key={menuSeed}
            className={`flex flex-col gap-8 w-full transition-all duration-150 ${
              isCompleted && "opacity-0"
            }`}
          >
            <Controls mode={mode} changeMode={changeMode} />

            <div
              id="testSection"
              style={{ transitionDuration: `${TEST_RESTART_DURATION}ms` }}
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
