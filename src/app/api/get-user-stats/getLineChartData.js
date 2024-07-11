function getAverage(stat, averageOf, testHistory) {
  return testHistory.map((_, index) => {
    const startingValue = index > averageOf - 1 ? index - (averageOf - 1) : 0;

    let total = 0;
    let testCount = 0;

    for (let i = startingValue; i <= index; i++) {
      total += +testHistory[i][stat];
      testCount++;
    }

    return total / testCount;
  });
}

const getLineChartData = (tests) => {
  tests.reverse();

  return {
    scatterWPM: tests.map((test, x) => ({ x, y: `${test.wpm}` })),
    averageOf100WPM: getAverage("wpm", 100, tests),
    averageOf10WPM: getAverage("wpm", 10, tests),
    scatterAcc: tests.map((test, x) => ({ x, y: `${test.accuracy}` })),
    averageOf100Acc: getAverage("accuracy", 100, tests),
    averageOf10Acc: getAverage("accuracy", 10, tests),
  };
};

export default getLineChartData;
