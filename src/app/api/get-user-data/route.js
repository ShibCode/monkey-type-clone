import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

const modes = {
  words: [10, 25, 50, 100],
  time: [15, 30, 60, 120],
};

const round = (num) => {
  return parseFloat(num).toFixed(2);
};

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

export async function POST(req, res) {
  try {
    await dbConnect();
    const query = await req.json();
    const user = await User.findOne(query); // getting user data from db

    const { testHistory } = user;

    const reverseTestHistory = testHistory.map(
      (_, i, testHistory) => testHistory[testHistory.length - 1 - i]
    );

    const bestTests = {}; // finding best tests

    for (let modeName of Object.keys(modes)) {
      const mode = modes[modeName];

      const bestTestsOfMode = {};

      for (let category of mode) {
        let bestTestIndex = 0;

        const filteredTests = testHistory.filter(
          (test) =>
            test.mode.name === modeName && test.mode.category === category
        );

        filteredTests.forEach((test, i) => {
          if (+test.wpm > +filteredTests[bestTestIndex].wpm) bestTestIndex = i;
        });

        bestTestsOfMode[category] = filteredTests[bestTestIndex]
          ? filteredTests[bestTestIndex]
          : {
              mode: {
                name: modeName,
                category,
              },
            };
      }
      bestTests[modeName] = bestTestsOfMode;
    }

    // getting total time typed
    const totalSecondsTyped = testHistory.reduce((a, b) => a + +b.timeTaken, 0);
    let hours = Math.floor(totalSecondsTyped / 3600).toString();
    let minutes = Math.floor(
      totalSecondsTyped / 60 - Math.floor(totalSecondsTyped / 3600) * 60
    ).toString();
    let seconds = Math.round(totalSecondsTyped % 60).toString();

    if (hours.length === 1) hours = `0${hours}`;
    if (minutes.length === 1) minutes = `0${minutes}`;
    if (seconds.length === 1) seconds = `0${seconds}`;

    const timeTyping = `${hours}:${minutes}:${seconds}`;

    // getting data for wpm range chart
    const rawTestSpeedRange = {};

    testHistory.forEach((test, index) => {
      const roundedWpm = Math.floor(test.wpm);
      const wpmString = roundedWpm.toString();

      const range = `${wpmString.slice(0, wpmString.length - 1)}0`;

      if (rawTestSpeedRange[range]) rawTestSpeedRange[range] += 1;
      else rawTestSpeedRange[range] = 1;
    });

    const testSpeedRange = {};

    Object.keys(rawTestSpeedRange).map((range) => {
      const newRange = `${range} - ${+range + 9}`;
      testSpeedRange[newRange] = rawTestSpeedRange[range];
    });

    let bestTestKey = {
      name: "words",
      category: 10,
    };

    Object.keys(bestTests).map((modeName) => {
      const categories = modes[modeName];

      categories.map((key) => {
        const test = bestTests[modeName][key];

        if (+test.wpm > +bestTests[bestTestKey.name][bestTestKey.category].wpm)
          bestTestKey = { name: modeName, category: key };
      });
    });

    const last10Tests = reverseTestHistory.slice(
      testHistory.length - 10,
      testHistory.length
    );

    let highestRawWpm = 0;

    const averageRawWpm = round(
      testHistory.reduce((a, b) => {
        if (+b.raw > highestRawWpm) highestRawWpm = b.raw;

        return a + +b.raw;
      }, 0) / testHistory.length
    );

    let highestAccuracy = 0;

    const averageAccuracy = round(
      testHistory.reduce((a, b) => {
        if (+b.accuracy > highestAccuracy) highestAccuracy = b.accuracy;

        return a + +b.accuracy;
      }, 0) / testHistory.length
    );

    const detailedStats = [
      {
        name: "tests started",
        value: testHistory.length,
      },
      {
        name: "tests completed",
        value: testHistory.length,
      },
      {
        name: "time typing",
        value: timeTyping,
      },
      {
        name: "highest wpm",
        value: bestTests[bestTestKey.name][bestTestKey.category].wpm,
      },
      {
        name: "average wpm",
        value: round(
          testHistory.reduce((a, b) => a + +b.wpm, 0) / testHistory.length
        ),
      },
      {
        name: "average wpm (last 10 tests)",
        value: round(last10Tests.reduce((a, b) => a + +b.wpm, 0) / 10),
      },
      {
        name: "highest raw wpm",
        value: highestRawWpm,
      },
      {
        name: "average raw wpm",
        value: averageRawWpm,
      },
      {
        name: "average raw wpm (last 10 tests)",
        value: round(last10Tests.reduce((a, b) => a + +b.raw, 0) / 10),
      },
      {
        name: "highest accuracy",
        value: highestAccuracy + "%",
      },
      {
        name: "avg accuracy",
        value: averageAccuracy + "%",
      },
      {
        name: "avg accuracy (last 10 tests)",
        value:
          round(last10Tests.reduce((a, b) => a + +b.accuracy, 0) / 10) + "%",
      },
    ];

    const chartData = {
      scatterWPM: reverseTestHistory.map((test, index) => {
        return {
          x: index,
          y: `${test.wpm}`,
        };
      }),
      averageOf100WPM: getAverage("wpm", 100, reverseTestHistory),
      averageOf10WPM: getAverage("wpm", 10, reverseTestHistory),
      scatterAcc: reverseTestHistory.map((test, index) => {
        return {
          x: index,
          y: `${test.accuracy}`,
        };
      }),
      averageOf100Acc: getAverage("accuracy", 100, reverseTestHistory),
      averageOf10Acc: getAverage("accuracy", 10, reverseTestHistory),
    };

    return NextResponse.json({
      user: {
        ...user._doc,
        bestTests,
        timeTyping,
        totalTestsCompleted: testHistory.length,
        testHistory: testHistory.slice(0, 10),
      },
      testSpeedRange,
      detailedStats,
      chartData,
    });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" });
  }
}
