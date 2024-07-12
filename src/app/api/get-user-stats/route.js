import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const start = Date.now();

    const { userId } = await req.json();

    function getAllTimeStats() {
      return new Promise((resolve) => {
        Test.aggregate([
          {
            $match: {
              $expr: {
                $eq: ["$userId", { $toObjectId: userId }],
              },
            },
          },
          {
            $group: {
              _id: "$userId",
              "tests started": { $sum: 1 },
              "tests completed": { $sum: 1 },
              "time typing": { $sum: "$timeTaken" },
              "highest wpm": { $max: "$wpm" },
              "avg wpm": { $avg: "$wpm" },
              "highest raw wpm": { $max: "$raw" },
              "avg raw wpm": { $avg: "$raw" },
              "highest accuracy": { $max: "$accuracy" },
              "avg accuracy": { $avg: "$accuracy" },
            },
          },
          {
            $project: {
              _id: 0,
              "tests started": 1,
              "tests completed": 1,
              "time typing": 1,
              "highest wpm": { $round: ["$highest wpm", 2] },
              "avg wpm": { $round: ["$avg wpm", 2] },
              "highest raw wpm": { $round: ["$highest raw wpm", 2] },
              "avg raw wpm": { $round: ["$avg raw wpm", 2] },
              "highest accuracy": { $round: ["$highest accuracy", 2] },
              "avg accuracy": { $round: ["$avg accuracy", 2] },
            },
          },
        ]).then((result) => {
          resolve(result[0]);
        });
      });
    }

    function getSummarisedBestTests() {
      return new Promise((resolve) => {
        Test.aggregate([
          {
            $match: {
              $expr: {
                $eq: ["$userId", { $toObjectId: userId }],
              },
            },
          },
          { $sort: { wpm: -1 } },
          {
            $group: {
              _id: {
                name: "$mode.name",
                category: "$mode.category",
              },
              doc: { $first: "$$ROOT" },
            },
          },
          { $replaceRoot: { newRoot: "$doc" } },
          {
            $project: { wpm: 1, mode: 1, raw: 1, accuracy: 1, date: 1, _id: 0 },
          },
        ]).then((result) => {
          resolve(result);
        });
      });
    }

    function getDetailedBestTests() {
      return new Promise((resolve) => {
        Test.aggregate([
          {
            $match: {
              $expr: {
                $eq: ["$userId", { $toObjectId: userId }],
              },
            },
          },
          { $sort: { wpm: -1 } },
          {
            $group: {
              _id: {
                mode: {
                  name: "$mode.name",
                  category: "$mode.category",
                },
                language: "$language",
              },
              doc: { $first: "$$ROOT" },
            },
          },
          { $replaceRoot: { newRoot: "$doc" } },
          {
            $project: {
              wpm: 1,
              mode: 1,
              language: 1,
              raw: 1,
              accuracy: 1,
              date: 1,
              _id: 0,
            },
          },
        ]).then((result) => {
          resolve(result);
        });
      });
    }

    function getLast10Tests() {
      return new Promise((resolve) => {
        Test.find({ userId })
          .sort({ createdAt: "descending" })
          .limit(10)
          .then((result) => {
            resolve(result);
          });
      });
    }

    function getBarChartData() {
      return new Promise((resolve) => {
        Test.aggregate([
          {
            $match: {
              $expr: {
                $eq: ["$userId", { $toObjectId: userId }],
              },
            },
          },
          {
            $bucket: {
              groupBy: "$wpm",
              boundaries: [
                0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140,
                150, 160, 170, 180, 190, 200,
              ],
              default: "Other",
            },
          },
        ]).then((result) => {
          const raw = result.map((range) => {
            return { lb: range._id, count: range.count };
          });

          const repititions = raw[raw.length - 1].lb / 10 + 1;

          const data = new Array(repititions).fill(0).reduce((acc, _, i) => {
            const lb = i * 10;
            const ub = lb + 9;

            const range = raw.find((range) => range.lb === lb);

            return { ...acc, [`${lb}-${ub}`]: range ? range.count : 0 };
          }, {});

          resolve(data);
        });
      });
    }

  

    const promises = {
      allTimeStats: getAllTimeStats(),
      summarisedBestTests: getSummarisedBestTests(),
      detailedBestTests: getDetailedBestTests(),
      last10: getLast10Tests(),
      barChartData: getBarChartData(),
      // lineChartData: getLineChartData(),
    };

    const result = (await Promise.all(Object.values(promises))).reduce(
      (acc, result, index) => {
        return { ...acc, [Object.keys(promises)[index]]: result };
      },
      {}
    );

    const getAverageStat = (stat) => {
      const total = result.last10.reduce((acc, test) => acc + test[stat], 0);
      return (total / result.last10.length).toFixed(2);
    };

    result.allTimeStats["avg wpm (last 10 tests)"] = getAverageStat("wpm");
    result.allTimeStats["avg raw wpm (last 10 tests)"] = getAverageStat("raw");
    result.allTimeStats["avg accuracy (last 10 tests)"] =
      getAverageStat("accuracy");

    const response = {
      bestTests: {
        summarised: result.summarisedBestTests,
        detailed: result.detailedBestTests,
      },
      allTimeStats: result.allTimeStats,
      isMoreTests: result.allTimeStats["tests completed"] > 10,
      tests: result.last10,
      barChartData: result.barChartData,
      // lineChartData: result.lineChartData,
    };

    console.log(Date.now() - start);

    return NextResponse.json({ ...response });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" });
  }
}
