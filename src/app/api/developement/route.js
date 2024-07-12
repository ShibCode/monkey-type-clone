import TestStarted from "@/context/TestStarted";
import { Test } from "@/model/test";
import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import { generateTestData } from "./generateTestData";

const userIds = [
  "657aed4342f88c207ef66e4a",
  "6582b6be4d809ac04b2fcb78",
  "65898e4821cead63d7fd2eb0",
  "668fc2ee6a2a652db68196fd",
  "668fc2ee6a2a652db68196fe",
  "668fc2ee6a2a652db68196ff",
  "668fc2ee6a2a652db6819700",
  "668fc2ee6a2a652db6819701",
  "668fc2ee6a2a652db6819702",
  "668fc2ee6a2a652db6819703",
  "668fc2ee6a2a652db6819704",
  "668fc2ee6a2a652db6819705",
  "668fc2ee6a2a652db6819706",
  "668fc2ee6a2a652db6819707",
  "668fc2ee6a2a652db6819708",
  "668fc2ee6a2a652db6819709",
  "668fc2ee6a2a652db681970a",
  "668fc2ee6a2a652db681970b",
  "668fc2ee6a2a652db681970c",
  "668fc2ee6a2a652db681970d",
  "668fc2ee6a2a652db681970e",
  "668fc2ee6a2a652db681970f",
  "668fc2ee6a2a652db6819710",
];

export async function GET() {
  try {
    await dbConnect();

    const start = new Date();

    // const data = generateTestData(["657aed4342f88c207ef66e4a"], 2000);

    const userId = "657aed4342f88c207ef66e4a";

    const data = await Test.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$userId", { $toObjectId: userId }],
          },
        },
      },

      { $sort: { createdAt: 1 } }, // Sort by createdAt

      // Compute rolling averages
      {
        $setWindowFields: {
          sortBy: { createdAt: 1 },
          output: {
            averageWpmLast100: {
              $avg: "$wpm",
              window: { documents: [-99, 0] },
            },
            averageWpmLast10: {
              $avg: "$wpm",
              window: { documents: [-9, 0] },
            },
            averageAccLast100: {
              $avg: "$accuracy",
              window: { documents: [-99, 0] },
            },
            averageAccLast10: {
              $avg: "$accuracy",
              window: { documents: [-9, 0] },
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },
      { $limit: 1000 },
      { $sort: { createdAt: 1 } },

      // Project the required fields
      {
        $project: {
          _id: 0,
          wpm: 1,
          // raw: 1,
          accuracy: 1,
          // mode: 1,
          // language: 1,
          // date: 1,
          // time: 1,
          averageWpmLast100: 1,
          averageWpmLast10: 1,
          averageAccLast100: 1,
          averageAccLast10: 1,
        },
      },
    ]);
    // .reduce(
    //   (acc, test) => {
    //     return {
    //       scatterWPM: [...acc["scatterWPM"], test.wpm],
    //       averageOf100WPM: [...acc["averageOf100WPM"], test.averageWpmLast100],
    //       averageOf10WPM: [...acc["averageOf10WPM"], test.averageWpmLast10],
    //       scatterAcc: [...acc["scatterAcc"], test.accuracy],
    //       averageOf100Acc: [...acc["averageOf100Acc"], test.averageAccLast100],
    //       averageOf10Acc: [...acc["averageOf10Acc"], test.averageAccLast10],
    //     };
    //   },
    //   {
    //     scatterWPM: [],
    //     averageOf100WPM: [],
    //     averageOf10WPM: [],
    //     scatterAcc: [],
    //     averageOf100Acc: [],
    //     averageOf10Acc: [],
    //   }
    // );

    const timeTaken = new Date() - start;

    return NextResponse.json({ timeTaken, data });
  } catch (e) {
    console.log(e);
  }
}
