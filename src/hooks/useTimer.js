import { useRef, useState } from "react";

export default function useTimer() {
  const [time, setTime] = useState(0);

  const id = useRef();

  const updateTime = (currentTime, refTime) => {
    const newTime = (time + (currentTime - refTime)).toFixed(0);

    if (+newTime > 0) {
      setTime(+newTime);
      id.current = requestAnimationFrame((ct) => updateTime(ct, refTime));
    } else setTime(0);
  };

  const start = () => {
    if (id.current) return;

    const refTime = performance.now();
    requestAnimationFrame((ct) => updateTime(ct, refTime));
  };

  const stop = () => {
    cancelAnimationFrame(id.current);
    id.current = null;
  };

  return [Math.floor(time / 1000), time, start, stop];
}
