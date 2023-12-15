const getHighestStat = (tests, stat) => {
  return tests.reduce((acc, test) => (test[stat] > acc ? test[stat] : acc), 0);
};

const getAverageStat = (tests, stat) => {
  const total = tests.reduce((acc, test) => acc + test[stat], 0);
  return +parseFloat(total / tests.length).toFixed(2);
};

const getAllTimeStats = (tests, timeTyped) => {
  const last10Tests = tests.slice(0, 10);

  return [
    {
      name: "tests started",
      value: tests.length,
    },
    {
      name: "tests completed",
      value: tests.length,
    },
    {
      name: "time typing",
      value: timeTyped,
    },
    {
      name: "highest wpm",
      value: getHighestStat(tests, "wpm"),
    },
    {
      name: "average wpm",
      value: getAverageStat(tests, "wpm"),
    },
    {
      name: "average wpm (last 10 tests)",
      value: getAverageStat(last10Tests, "wpm"),
    },
    {
      name: "highest raw wpm",
      value: getHighestStat(tests, "raw"),
    },
    {
      name: "average raw wpm",
      value: getAverageStat(tests, "raw"),
    },
    {
      name: "average raw wpm (last 10 tests)",
      value: getAverageStat(last10Tests, "raw"),
    },
    {
      name: "highest accuracy",
      value: getHighestStat(tests, "accuracy"),
    },
    {
      name: "avg accuracy",
      value: getAverageStat(tests, "accuracy"),
    },
    {
      name: "avg accuracy (last 10 tests)",
      value: getAverageStat(last10Tests, "accuracy"),
    },
  ];
};

export default getAllTimeStats;
