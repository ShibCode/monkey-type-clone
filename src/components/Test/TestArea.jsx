import React, { useEffect, useRef, useState } from "react";
import validChars from "@/validChars";
import calculateWpm from "@/utils/calulateWpm";
import { useTestEssentials } from "@/context/TestEssentials";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import useTimer from "@/hooks/useTimer";
import { useSettings } from "@/context/Settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmerica,
  faMousePointer,
} from "@fortawesome/free-solid-svg-icons";
import ChangeLanguageModal from "../ChangeLanguageModal";
import { useLanguage } from "@/context/Language";
import Word from "./Word";

const WORDS_TO_SHOW_FOR_TIME_MODE = 100;

const TestArea = ({
  setResult,
  setIsCompleted,
  setWpmEachSecond,
  setRawWpmEachSecond,
  setErrorsEachSecond,
  mode,
  duringTestRestart,
}) => {
  const [words, setWords] = useState([]);
  const [typedWords, setTypedWords] = useState([]);

  const [latestWpm, setLatestWpm] = useState(0);

  const [position, setPosition] = useState({ word: 0, part: 0, char: 0 });

  const [caretPosition, setCaretPosition] = useState({
    top: 1,
    left: 0,
  });

  const [isHoldingControl, setIsHoldingControl] = useState(false);

  const [isFocused, setIsFocused] = useState(true);

  const wordsWrapper = useRef(null);
  const unfocusTimeout = useRef(null);

  const [seconds, time, startTimer, stopTimer] = useTimer();
  const { testStarted, setTestStarted, modalOpen } = useTestEssentials();
  const { getSettingValue } = useSettings();
  const language = useLanguage();

  const generatePara = () => {
    const words = [];

    const cap =
      mode.name === "words" ? mode.category : WORDS_TO_SHOW_FOR_TIME_MODE;

    for (let i = 0; i < cap; i++) {
      let rng = Math.floor(Math.random() * language.words.length);

      if (language.words[rng] === words[words.length - 1]) {
        rng = Math.floor(Math.random() * language.words.length);
      }

      words.push(language.words[rng].split(" "));
    }

    return words;
  };

  const getResult = (isCompleted = false) => {
    const result = { correct: 0, incorrect: 0, missed: 0, extra: 0 };

    if (mode.name === "words" && isCompleted) {
      words.forEach((word, wIndex) => {
        const typedWord = typedWords[wIndex];

        word.forEach((part, pIndex) => {
          const typedPart = typedWord[pIndex];

          part.split("").forEach((char, cIndex) => {
            if (typedPart[cIndex] === char) result.correct++;
            else if (typedPart[cIndex] === undefined) result.missed++;
            else if (typedPart[cIndex] !== char) result.incorrect++;
          });

          if (typedWord.length > part.length)
            result.extra += typedWord.length - part.length;
          result.correct += 1;
        });
      });
      result.correct -= 1;
    } else {
      for (let i = 0; i <= position.word; i++) {
        const actualWord = words[i] ?? [];
        const typedWord = typedWords[i] ?? [];

        for (let j = 0; j <= position.part; j++) {
          const actualPart = actualWord[j] ?? "";
          const typedPart = typedWord[j] ?? "";

          const charCap =
            i === position.word ? position.char : actualPart.length;

          for (let k = 0; k < charCap; k++) {
            if (typedPart[k] === actualPart[k]) result.correct++;
            else if (typedPart[k] === undefined) result.missed++;
            else if (typedPart[k] !== actualPart[k]) result.incorrect++;
          }

          if (typedPart.length > actualPart.length) {
            result.extra += typedPart.length - actualPart.length;
          }
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
    if (modalOpen) return;

    if (!isFocused) {
      setIsFocused(true);
      if (!testStarted && getSettingValue("out of focus warning") === "show")
        return;
    }

    setIsHoldingControl((bool) => {
      setPosition((position) => {
        if (validChars.includes(e.key)) {
          setTypedWords((prev) => {
            const lastWord = prev[position.word] ?? [];
            const lastPart = lastWord[position.part] ?? "";
            const newPart = lastPart + e.key;
            const newWord = [...lastWord.slice(0, position.part), newPart];

            return [...prev.slice(0, position.word), newWord];
          });

          return { ...position, char: position.char + 1 };
        } else if (e.key === " " && position.char !== 0) {
          if (words[position.word].length > position.part + 1) {
            return { word: position.word, part: position.part + 1, char: 0 };
          } else return { word: position.word + 1, part: 0, char: 0 };
        } else if (e.key === "Backspace" && position.char !== 0) {
          setTypedWords((prev) => {
            const { word, part, char } = position;

            // bool refers to whether the user is holding ctrl or not
            const backspacedWords = bool
              ? [...prev.slice(0, word), prev[word].slice(0, part)]
              : [
                  ...prev.slice(0, word),
                  [
                    ...prev[word].slice(0, part),
                    prev[word][part].slice(0, char - 1),
                  ],
                ];
            return backspacedWords;
          });

          return { ...position, char: bool ? 0 : position.char - 1 };
        } else if (e.key === "Control") setIsHoldingControl(true);

        if (e.key === "Tab") {
          e.preventDefault();
          const restartBtn = document.querySelector("#restartBtn");
          restartBtn.focus();
        }
        return position;
      });

      return bool;
    });
  };

  const handleKeyUp = (e) => {
    if (e.key === "Control") setIsHoldingControl(false);
  };

  const moveCaret = () => {
    const { word, part, char } = position;

    const character = document.getElementById(`letter-${word}${part}${char}`);

    if (character === null && char > 0) {
      const character = document.getElementById(
        `letter-${word}${part}${char - 1}`
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

  useUpdateEffect(() => {
    if (
      mode.name === "time" &&
      typedWords.length === words.length - 0.5 * WORDS_TO_SHOW_FOR_TIME_MODE
    ) {
      const words = generatePara();
      setWords((prev) => [...prev, ...words]);
    } // to ensure that there are enough words for the time mode

    // this piece of code is responsible for catching the time frame of errors to show in the result chart
    if (typedWords.length !== 0) {
      const lastWord = typedWords[typedWords.length - 1];
      const lastPart = lastWord[lastWord.length - 1];

      if (!lastPart) return () => {};

      const typedLetter = lastPart[lastPart.length - 1];

      const actualWord = words[typedWords.length - 1];
      const actualPart = actualWord[lastWord.length - 1];
      const actualLetter = actualPart[lastPart.length - 1];

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
    if (words.length <= 0) return;

    const lastWord = words[words.length - 1];
    const lastPart = lastWord[lastWord.length - 1];

    if (typedWords.length !== 0 && time === 0) {
      setTestStarted(true);
      startTimer();
    } else if (
      (mode.name === "words" &&
        ((position.word === mode.category - 1 &&
          position.part === lastWord.length - 1 &&
          position.char === lastPart.length) ||
          position.word === mode.category)) ||
      (mode.name === "time" && seconds >= mode.category)
    ) {
      stopTimer();
      getResult(true);
      setIsCompleted(true);
      setTestStarted(false);
    }
  }, [position, seconds]);

  useEffect(() => {
    const words = generatePara();
    setWords(words);
  }, []);

  useUpdateEffect(() => {
    if (modalOpen) setIsFocused(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [words, isFocused, testStarted, modalOpen]);

  useEffect(() => {
    moveCaret();
  }, [position]);

  useUpdateEffect(getResult, [seconds]);

  useEffect(() => {
    if (caretPosition.top - 1 > 42) {
      wordsWrapper.current.scrollTop = caretPosition.top - 43;
    }
  }, [caretPosition.top]);

  const focus = (e) => {
    e.stopPropagation();

    if (unfocusTimeout.current) clearTimeout(unfocusTimeout.current);

    setIsFocused(true);
  };

  const unfocus = (e) => {
    if (isFocused) {
      unfocusTimeout.current = setTimeout(() => setIsFocused(false), 400);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      wordsWrapper.current?.addEventListener("click", focus);
      window.addEventListener("click", unfocus);
    }, 500);

    return () => {
      wordsWrapper.current?.removeEventListener("click", focus);
      window.removeEventListener("click", unfocus);
    };
  }, []);

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
              {mode.name === "words"
                ? `${position.word}/${mode.category}`
                : mode.category - seconds}
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

      {isFocused}

      <div
        ref={wordsWrapper}
        className={`h-[116px] overflow-hidden scroll-smooth relative`}
      >
        <div
          style={{ wordSpacing: "3px" }}
          className={`absolute pointer-events-none transition-opacity duration-200 text-tertiary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-wider text-lg flex gap-2.5 items-center ${
            (isFocused || getSettingValue("out of focus warning") !== "show") &&
            "opacity-0"
          }`}
        >
          <FontAwesomeIcon icon={faMousePointer} /> Click here or press any key
          to focus
        </div>

        <div
          className={`flex flex-wrap gap-2.5 relative items-start transition-[filter] duration-200 ${
            !isFocused &&
            getSettingValue("out of focus warning") === "show" &&
            "blur-[5px]"
          }`}
        >
          <div
            style={{ top: caretPosition.top, left: caretPosition.left || 0 }}
            className={`w-0.5 h-8 bg-secondary absolute transition-all ease-linear duration-100 ${
              time === 0 && "animate-blink"
            } ${isFocused ? "" : "!opacity-0"}`}
          ></div>
          {words.map((word, wIndex) => (
            <Word
              key={wIndex}
              word={word}
              wIndex={wIndex}
              typedWords={typedWords}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TestArea;
