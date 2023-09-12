import { useEffect, useState } from "react";
import useUpdateEffect from "./useUpdateEffect";

export default function useTimer(typedWordsLength) {
  const [time, setTime] = useState(0);
  const [referenceTime, setReferenceTime] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const countUp = () => {
    setTime((prevTime) => {
      const now = Date.now();
      const interval = now - referenceTime;
      setReferenceTime(now);
      setSeconds(Math.floor((prevTime + interval) / 1000));

      return prevTime + interval;
    });
  };

  useEffect(() => {
    if (typedWordsLength !== 0 && time === 0) setReferenceTime(Date.now());
  }, [typedWordsLength]);

  useUpdateEffect(() => setTimeout(countUp, 1), [referenceTime]);

  return [time, seconds, setReferenceTime];
}
