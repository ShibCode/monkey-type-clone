"use client";

import React, { useEffect, useState } from "react";

const Test = () => {
  const [time, setTime] = useState(0);
  const [referenceTime, setReferenceTime] = useState(Date.now());
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const countUp = () => {
      setTime((prevTime) => {
        const now = Date.now();
        const interval = now - referenceTime;
        setReferenceTime(now);
        setSeconds(Math.floor((prevTime + interval) / 1000));

        return prevTime + interval;
      });
    };

    setTimeout(countUp, 1);
  }, [time]);
  return <>{seconds}</>;
};

export default Test;
