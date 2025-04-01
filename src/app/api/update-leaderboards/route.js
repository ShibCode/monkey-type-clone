import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const modes = [
  { text: "Words 10", mode: { name: "words", category: 10 } },
  { text: "Words 25", mode: { name: "words", category: 25 } },
  { text: "Words 50", mode: { name: "words", category: 50 } },
  { text: "Words 100", mode: { name: "words", category: 100 } },
  { text: "Time 15", mode: { name: "time", category: 15 } },
  { text: "Time 30", mode: { name: "time", category: 30 } },
  { text: "Time 60", mode: { name: "time", category: 60 } },
  { text: "Time 120", mode: { name: "time", category: 120 } },
];

const getTop100 = async (mode) => {
  return await Test.aggregate([
    {
      $match: {
        "mode.name": mode.name,
        "mode.category": mode.category,
      },
    },
    {
      $project: {
        timeTaken: 0,
        isPersonalBest: 0,
        mode: 0,
        language: 0,
        __v: 0,
        _id: 0,
      },
    },
    { $sort: { wpm: -1 } },
    { $group: { _id: "$userId", fastestTest: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$fastestTest" } },
    { $sort: { wpm: -1 } },
    { $limit: 100 },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { _id: 0, username: 1 } }],
      },
    },
    { $unwind: "$user" },
    { $set: { username: "$user.username" } },
    { $unset: ["user"] },
  ]);
};

export async function GET() {
  try {
    const client = await dbConnect();

    const db = client.connection;

    const updatePromises = modes.map(
      (mode) =>
        new Promise(async (resolve) => {
          const collection = db.collection(mode.text);
          const top100 = await getTop100(mode.mode);

          // const session = await mongoose.startSession();

          const data = {
            mode: mode.text,
          };

          try {
            // session.startTransaction();

            await collection.deleteMany({}, { session });
            data.insert = await collection.insertMany(top100, { session });
            data.data = top100;

            // await session.commitTransaction();
          } catch (error) {
            // await session.abortTransaction();
          } finally {
            // session.endSession();
          }

          resolve(data);
        })
    );

    const promises = await Promise.all(updatePromises);
    const data = promises.reduce(
      (acc, curr) => ({ ...acc, [curr.mode]: curr }),
      {}
    );

    return NextResponse.json({ ...data });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Something went wrong" });
  }
}
