import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

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

    const { mode } = await req.json();

    const activeMode = modes.find((c) => c.text === mode)?.mode;

    if (!activeMode) {
      return NextResponse.json({
        success: false,
        message: "Invalid category",
      });
    }

    const top100 = await Test.aggregate([
      {
        $match: {
          "mode.name": activeMode.name,
          "mode.category": activeMode.category,
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

    return NextResponse.json({ success: true, leaderboardsData: top100 });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
}
