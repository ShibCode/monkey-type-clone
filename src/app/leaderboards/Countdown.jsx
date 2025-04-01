import React, { useState, useEffect } from "react";
import { getNextScheduledTime } from "@/utils/getNextScheduledTime";

const Countdown = () => {
  const targetTime = getNextScheduledTime(
    "2025-04-01T00:00:00+05:00",
    60 * 24
  ).getTime();

  const [timeLeft, setTimeLeft] = useState(targetTime - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = targetTime - new Date().getTime();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const formatTime = (ms) => {
    const pad = (n) => n.toString().padStart(2, "0");

    const hours = pad(Math.floor(ms / (1000 * 60 * 60)) % 60);
    const minutes = pad(Math.floor(ms / (1000 * 60)) % 60);
    const seconds = pad(Math.floor(ms / 1000) % 60);

    return `${hours}:${minutes}:${seconds}`;
  };

  return <p className="text-primary">Next Update In: {formatTime(timeLeft)}</p>;
};

export default Countdown;
