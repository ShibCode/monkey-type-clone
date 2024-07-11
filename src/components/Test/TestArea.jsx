import React, { useEffect, useRef, useState } from "react";
import validChars from "@/validChars";
import calculateWpm from "@/utils/calulateWpm";
import { useTestStarted } from "@/context/TestStarted";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import useTimer from "@/hooks/useTimer";
import { useSettings } from "@/context/Settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmerica } from "@fortawesome/free-solid-svg-icons";
import ChangeLanguageModal from "../ChangeLanguageModal";

const WORDS_TO_SHOW_FOR_TIME_MODE = 100;

const TestArea = ({
  setResult,
  setIsCompleted,
  setWpmEachSecond,
  setRawWpmEachSecond,
  setErrorsEachSecond,
  mode,
  totalWords,
  totalTime,
  duringTestRestart,
}) => {
  const [words, setWords] = useState([]);
  const [typedWords, setTypedWords] = useState([]);

  const [latestWpm, setLatestWpm] = useState(0);

  const [position, setPosition] = useState({
    word: 0,
    charInWord: 0,
  });

  const [caretPosition, setCaretPosition] = useState({
    top: 1,
    left: 0,
  });

  const [isHoldingControl, setIsHoldingControl] = useState(false);

  const [seconds, time, startTimer, stopTimer] = useTimer();

  const [state, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const { testStarted, setTestStarted } = useTestStarted();

  const { getSettingValue } = useSettings();

  const generatePara = async () => {
    const activeLanguage = getSettingValue("language");
    const words = [];

    const response = await fetch(`/languages/${activeLanguage}.json`);
    const language = await response.json();

    const cap = mode === "words" ? totalWords : WORDS_TO_SHOW_FOR_TIME_MODE;

    for (let i = 0; i < cap; i++) {
      let rng = Math.floor(Math.random() * language.words.length);

      if (language.words[rng] === words[words.length - 1]) {
        rng = Math.floor(Math.random() * language.words.length);
      }

      words.push(language.words[rng]);
    }

    return words;
  };

  const getResult = (isCompleted = false) => {
    const result = { correct: 0, incorrect: 0, missed: 0, extra: 0 };

    if (mode === "words" && isCompleted) {
      words.forEach((word, wIndex) => {
        const typedWord = typedWords[wIndex];
        word.split("").forEach((char, cIndex) => {
          if (typedWord[cIndex] === char) result.correct++;
          else if (typedWord[cIndex] === undefined) result.missed++;
          else if (typedWord[cIndex] !== char) result.incorrect++;
        });

        if (typedWord.length > word.length)
          result.extra += typedWord.length - word.length;
      });
      result.correct += totalWords - 1;
    } else {
      for (let i = 0; i <= position.word; i++) {
        const actualWord = words[i];
        const typedWord = typedWords[i];

        const charCap =
          i === position.word ? position.charInWord : actualWord.length;

        for (let j = 0; j < charCap; j++) {
          if (typedWord[j] === actualWord[j]) result.correct++;
          else if (typedWord[j] === undefined) result.missed++;
          else if (typedWord[j] !== actualWord[j]) result.incorrect++;
        }

        const typedWordLength = typedWord ? typedWord.length : 0;

        if (typedWordLength > actualWord.length) {
          result.extra += typedWord.length - actualWord.length;
        }
      }
      result.correct += position.word;
    }

    if (isCompleted) {
      const timeTaken = parseFloat(time / 1000).toFixed(2);
      setResult({ ...result, timeTaken });
    } else {
      const wpm = calculateWpm(result.correct, seconds);
      const wpmRaw = calculateWpm(result.correct + result.incorrect, seconds);
      setWpmEachSecond((prev) => [...prev, wpm]);
      setRawWpmEachSecond((prev) => [...prev, wpmRaw]);

      setLatestWpm(wpm);
    }

    return () => {};
  };

  const handleKeyDown = (e) => {
    setIsHoldingControl((bool) => {
      setPosition((position) => {
        if (validChars.includes(e.key)) {
          setTypedWords((prev) => {
            const lastWord = prev[position.word];
            const newWord = lastWord ? lastWord + e.key : e.key;
            const newArr = prev.slice(0, position.word);
            newArr.push(newWord);
            return newArr;
          });

          return { ...position, charInWord: position.charInWord + 1 };
        } else if (e.key === " " && position.charInWord !== 0) {
          return { word: position.word + 1, charInWord: 0 };
        } else if (e.key === "Backspace" && position.charInWord !== 0) {
          setTypedWords((prev) => {
            const backspacedWords = bool
              ? prev.slice(0, position.word)
              : [
                  ...prev.slice(0, position.word),
                  prev[position.word].slice(0, position.charInWord - 1),
                ];
            return backspacedWords;
          });

          return {
            ...position,
            charInWord: bool ? 0 : position.charInWord - 1,
          };
        } else if (e.key === "Control") {
          setIsHoldingControl(true);
        }
        if (e.key === "Tab") {
          e.preventDefault();
          const restartBtn = document.querySelector("#restartBtn");
          restartBtn.focus();
        }

        return position;
      });
      return bool;
    });
    forceUpdate();
  };

  const handleKeyUp = (e) => {
    if (e.key === "Control") setIsHoldingControl(false);
  };

  const moveCaret = () => {
    const { word, charInWord } = position;

    const character = document.querySelector(`.letter-${word}-${charInWord}`);

    if (character === null && charInWord > 0) {
      const character = document.querySelector(
        `.letter-${word}-${charInWord - 1}
        `
      );

      setCaretPosition((prev) => ({
        ...prev,
        left: character.offsetLeft + character.offsetWidth,
      }));
    } else {
      setCaretPosition({
        top: character?.offsetTop,
        left: character?.offsetLeft,
      });
    }
  };

  const wordsUpdatedRef = useRef(false);

  useUpdateEffect(() => {
    if (
      mode === "time" &&
      typedWords.length === words.length - 0.5 * WORDS_TO_SHOW_FOR_TIME_MODE &&
      !wordsUpdatedRef.current
    ) {
      wordsUpdatedRef.current = true;
      generatePara().then((words) => {
        setWords((prev) => [...prev, ...words]);
        wordsUpdatedRef.current = false;
      });
    }

    if (typedWords.length !== 0) {
      const lastWord = typedWords[typedWords.length - 1];
      const typedLetter = lastWord[lastWord.length - 1];

      const actualWord = words[typedWords.length - 1];
      const actualLetter = actualWord[lastWord.length - 1];

      if (typedLetter !== actualLetter) {
        setErrorsEachSecond((prev) => {
          if (seconds >= prev.length) {
            return [
              ...prev,
              ...new Array(seconds - prev.length).fill(undefined),
              1,
            ];
          }

          return [
            ...prev.slice(0, prev.length - 1), // gets all elements except last
            (prev[prev.length - 1] += 1), // adds last element after adding 1
          ];
        });
      }
    }

    return () => {};
  }, [typedWords]);

  useEffect(() => {
    if (typedWords.length !== 0 && time === 0) startTimer();
    else if (
      (mode === "words" &&
        ((typedWords.length === totalWords &&
          typedWords[totalWords - 1].length === words[totalWords - 1].length) ||
          position.word === totalWords)) ||
      (mode === "time" && seconds >= totalTime)
    ) {
      stopTimer();
      getResult(true);
      setIsCompleted(true);
      setTestStarted(false);
    }
  }, [position, seconds]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    generatePara().then((words) => setWords(words));

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    moveCaret();
  }, [position]);

  useUpdateEffect(getResult, [seconds]);

  useEffect(() => {
    const words = document.getElementById("wordsWrapper");
    if (caretPosition.top - 1 > 42) words.scrollTop = caretPosition.top - 43;
  }, [caretPosition.top]);

  const [languageModalIsActive, setLanguageModalIsActive] = useState(false);

  return (
    <>
      <div className="mb-3 h-8 w-full flex flex-col relative">
        <div
          className={`text-secondary flex gap-8 opacity-0 transition-opacity duration-150 text-2xl ${
            testStarted ? "opacity-100" : "opacity-0"
          } ${time !== 0 && "opacity-100"}`}
        >
          {getSettingValue("live progress") === "show" && (
            <div>
              {mode === "words"
                ? `${position.word}/${totalWords}`
                : totalTime - seconds}
            </div>
          )}
          {getSettingValue("live speed") === "show" && (
            <div>{Math.round(latestWpm)}</div>
          )}
        </div>

        <div
          className={`flex justify-center absolute transition-opacity duration-150 w-full h-full items-center ${
            testStarted ? "opacity-0" : "opacity-100"
          }`}
        >
          <div>
            <button
              className="text-primary flex items-center gap-4 hover:text-tertiary transition-all duration-150"
              onClick={() => setLanguageModalIsActive((prev) => !prev)}
            >
              <FontAwesomeIcon icon={faEarthAmerica} />
              <span>{getSettingValue("language").replace(/_/g, " ")}</span>
            </button>
            <ChangeLanguageModal
              isActive={languageModalIsActive}
              setIsActive={setLanguageModalIsActive}
              duringTestRestart={duringTestRestart}
            />
          </div>
        </div>
      </div>

      <div
        id="wordsWrapper"
        className="h-[116px] overflow-hidden scroll-smooth"
      >
        <div className="flex flex-wrap gap-2.5 relative items-start">
          <div
            className={`w-0.5 h-8 bg-secondary absolute transition-all ease-linear duration-100 ${
              time === 0 && "animate-blink"
            }`}
            style={{
              top: caretPosition.top,
              left: caretPosition.left || 0,
            }}
          ></div>
          {words.map((word, wIndex) => {
            return (
              <div key={wIndex} className="inline">
                {word.split("").map((char, cIndex) => {
                  const typedWord = typedWords[wIndex];
                  const typedWordLength = typedWord?.length || 0;

                  return (
                    <span
                      className={`text-2xl select-none ${`letter-${wIndex.toString()}-${cIndex.toString()} 
                      ${
                        typedWord && typedWord[cIndex] === char
                          ? getSettingValue("flip test colors") === "on"
                            ? "text-primary"
                            : "text-secondary"
                          : cIndex >= typedWordLength
                          ? getSettingValue("flip test colors") === "on"
                            ? "text-secondary"
                            : "text-primary"
                          : getSettingValue("blind mode") === ""
                          ? getSettingValue("flip test colors") === "on"
                            ? "text-primary"
                            : "text-secondary"
                          : "text-error"
                      }`} 
                    
                  `}
                      key={cIndex}
                    >
                      {char}
                    </span>
                  );
                })}

                {typedWords[wIndex] &&
                  typedWords[wIndex].length > word.length &&
                  typedWords[wIndex]
                    .split("")
                    .slice(word.length)
                    .map((char, eIndex) => {
                      return (
                        <span
                          className={`text-2xl select-none letter-${wIndex.toString()}-${(
                            word.length + eIndex
                          ).toString()}
                      } ${
                        getSettingValue("blind mode") === ""
                          ? getSettingValue("flip test colors") === "on"
                            ? "text-primary"
                            : "text-secondary"
                          : "text-error"
                      }`}
                          key={`00` + eIndex.toString()}
                        >
                          {char}
                        </span>
                      );
                    })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TestArea;
