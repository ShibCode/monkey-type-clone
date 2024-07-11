const getBarChartData = (tests) => {
  const rawTestSpeedRange = {};

  tests.forEach((test) => {
    const roundedWpm = Math.floor(test.wpm);
    const wpmString = roundedWpm.toString();

    const range = `${wpmString.slice(0, wpmString.length - 1)}0`;

    if (rawTestSpeedRange[range]) rawTestSpeedRange[range] += 1;
    else rawTestSpeedRange[range] = 1;
  });

  const rangesEntries = Object.entries(rawTestSpeedRange);

  const newRangeEntries = rangesEntries.reduce((acc, rangeEntry, index) => {
    const rangeStart = rangeEntry[0];
    const startingValue = index > 0 ? +rangesEntries[index - 1][0] + 10 : 0;

    const newEntries = [];

    for (let i = startingValue; i < rangeStart; i += 10) {
      newEntries.push([i, 0]);
    }

    return [...acc, ...newEntries, rangeEntry];
  }, []);

  const populatedRawTestSpeedRange = Object.fromEntries(newRangeEntries);

  const testSpeedRange = {};

  Object.keys(populatedRawTestSpeedRange).map((range) => {
    const newRange = `${range} - ${+range + 9}`;
    testSpeedRange[newRange] = populatedRawTestSpeedRange[range];
  });

  return testSpeedRange;
};

export default getBarChartData;
