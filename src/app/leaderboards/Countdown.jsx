import React, { useState, useEffect } from "react";

const getNextTargetTime = (baseHours, baseMinutes, intervalMinutes) => {
  const now = new Date();
  let target = new Date();
  target.setHours(baseHours, baseMinutes, 0, 0);

  // If the target time is in the past, increment it by the interval until it's in the future
  if (now >= target) {
    const nowMs = now.getTime();
    let targetMs = target.getTime();
    const intervalMs = intervalMinutes * 60 * 1000;

    // Calculate the smallest future target time directly
    const diff = nowMs - targetMs;
    const intervalsPassed = Math.ceil(diff / intervalMs);
    targetMs += intervalsPassed * intervalMs;

    target = new Date(targetMs);
  }

  return target;
};

const Countdown = () => {
  const targetTime = getNextTargetTime(15, 15, 15).getTime();

  const [timeLeft, setTimeLeft] = useState(targetTime - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = targetTime - new Date().getTime();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return <p className="text-primary">Next Update In: {formatTime(timeLeft)}</p>;
};

export default Countdown;
