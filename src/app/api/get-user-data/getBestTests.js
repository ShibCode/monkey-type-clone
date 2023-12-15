const modes = {
  words: [10, 25, 50, 100],
  time: [15, 30, 60, 120],
};

const getBestTests = (tests) => {
  const bestTests = {};

  for (let mode of Object.keys(modes)) {
    const bestTestsInMode = [];

    for (let category of modes[mode]) {
      // filters all tests to get only the tests of a specific mode and category
      const filteredTests = tests.filter(
        (test) => test.mode.name === mode && test.mode.category === category
      );

      if (filteredTests.length > 0) {
        // gets the best test of a category
        const { wpm, raw, accuracy, date } = filteredTests.reduce(
          (acc, test) => (test.wpm > acc.wpm ? test : acc),
          { wpm: 0 }
        );

        bestTestsInMode.push({ category, wpm, raw, accuracy, date }); // pushing best test
      } else bestTestsInMode.push({ category }); // this line pushes only category name when there are 0 tests in a category
    }

    bestTests[mode] = bestTestsInMode;
  }

  return bestTests;
};

export default getBestTests;
