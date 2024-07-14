// Function to generate a random number within a range
const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

const modes = [
  { name: "words", category: 10 },
  { name: "words", category: 25 },
  { name: "words", category: 50 },
  { name: "words", category: 100 },
  { name: "time", category: 15 },
  { name: "time", category: 30 },
  { name: "time", category: 60 },
  { name: "time", category: 120 },
];

// const ranges = {
//   beginner: [0, 20],
//   slow: [20, 40],
//   average: [40, 60],
//   aboveAverage: [60, 80],
//   fast: [80, 100],
//   professional: [100, 120],
//   extremelyFast: [120, 150],
//   worldClass: [150, 200],
// };

const levels = {
  beginner: 40,
  average: 60,
  aboveAverage: 90,
  fast: 110,
  professional: 130,
  extremelyFast: 150,
  worldClass: 180,
  exceptional: 210,
};

const getWpm = (level) => {
  const levelIndex = Object.keys(levels).indexOf(level);
  const mean = levels[level];
  const stdDev = 7 + levelIndex * 2; // Standard deviation calculation

  // Generate a normally distributed random value
  const wpm = Math.round(normalRandom(mean, stdDev));
  return Math.max(0, wpm); // Ensure WPM is non-negative
};

// Normal distribution function using Box-Muller transform
const normalRandom = (mean, stdDev) => {
  let u1 = Math.random();
  let u2 = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z * stdDev + mean;
};

const languages = ["english"];

export const generateTestData = (users, length = 10) => {
  // // wpm = wpm
  // //   .map((i) => Math.floor(i / 10))
  // //   .reduce((acc, curr) => {
  // //     if (acc[curr]) acc[curr] += 1;
  // //     else acc[curr] = 1;
  // //     return acc;
  // //   }, {});

  // // wpm = Object.entries(wpm).map(([key, value]) => [
  // //   `${+key * 10}-${+key * 10 + 9}`,
  // //   value,
  // // ]);

  // // wpm = Object.fromEntries(wpm);

  const tests = [];

  // Date range for the past year (milliseconds)
  const startDate = new Date().setFullYear(new Date().getFullYear() - 1);
  const endDate = Date.now();

  for (let i = 0; i < length; i++) {
    const chosenOne = users[Math.floor(Math.random() * users.length)];

    const userId = chosenOne._id;
    const mode = modes[Math.floor(Math.random() * 4)];

    const range = levels[Math.floor(Math.random() * levels.length)];

    const wpm = getWpm(chosenOne.level); // Random WPM
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
