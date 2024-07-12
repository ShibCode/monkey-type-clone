// Function to generate a random number within a range
const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

export const generateTestData = (userIds, length = 10) => {
  const tests = [];
  const modes = [
    { name: "words", category: 10 },
    { name: "words", category: 25 },
    { name: "words", category: 50 },
    { name: "words", category: 100 },
  ];
  const languages = ["english"];

  // Date range for the past year (milliseconds)
  const startDate = new Date().setFullYear(new Date().getFullYear() - 1);
  const endDate = Date.now();

  for (let i = 0; i < length; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const mode = modes[Math.floor(Math.random() * 4)];

    const wpm = getRandomNumber(120, 160); // Random WPM
    const accuracy = getRandomNumber(90, 100); // Random accuracy percentage
    const raw = wpm / (accuracy / 100); // Calculate raw WPM based on accuracy

    const total = mode.category * 5.5;
    const correct = Math.floor(total * (accuracy / 100));
    const incorrect = total - correct;
    const missed = Math.floor((getRandomNumber(0, 2) * mode.category) / 10);
    const extra = Math.floor((getRandomNumber(0, 2) * mode.category) / 10);

    const timeTaken = 12 * (total / wpm);

    // Calculate number of seconds and arrays based on time taken
    const numSeconds = Math.ceil(timeTaken) - 1;
    const wpmEachSecond = Array.from({ length: numSeconds }, () =>
      getRandomNumber(wpm - 10, wpm + 10)
    );
    wpmEachSecond.push(wpm);
    const rawWpmEachSecond = Array.from({ length: numSeconds }, () =>
      getRandomNumber(raw - 10, raw + 10)
    );
    wpmEachSecond.push(raw);
    const errorsEachSecond = Array.from({ length: numSeconds + 1 }, () => {
      const odd = getRandomNumber(1, 3);
      if (odd < 2) return null;
      else return Math.floor(getRandomNumber(1, 6));
    });

    // Random date and time within the past year
    const testDate = new Date(getRandomNumber(startDate, endDate));
    const date = `${testDate.getDate()} ${testDate.toLocaleString("default", {
      month: "short",
    })} ${testDate.getFullYear()}`;

    const time = `${testDate.getHours()}:${
      testDate.getMinutes() < 10 ? "0" : ""
    }${testDate.getMinutes()}`;

    const isPersonalBest = Math.random() < 0.05; // 5% chance for true

    // Create test object
    const test = {
      mode,
      userId,
      wpm: parseFloat(wpm.toFixed(2)),
      raw: parseFloat(raw.toFixed(2)),
      accuracy: parseFloat(accuracy.toFixed(2)),
      correct: correct,
      incorrect: incorrect,
      missed: missed,
      extra: extra,
      timeTaken: parseFloat(timeTaken.toFixed(2)),
      wpmEachSecond: wpmEachSecond.map((wpm) => parseFloat(wpm.toFixed(2))),
      rawWpmEachSecond: rawWpmEachSecond.map((raw) =>
        parseFloat(raw.toFixed(2))
      ),
      errorsEachSecond: errorsEachSecond,
      language: languages[Math.floor(Math.random() * languages.length)],
      isPersonalBest: isPersonalBest,
      date: date,
      time: time,
      createdAt: testDate,
      updatedAt: testDate,
    };

    tests.push(test);
  }

  return tests;
};
