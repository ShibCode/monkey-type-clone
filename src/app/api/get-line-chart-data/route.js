import { Test } from "@/model/test";
import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const start = new Date();

    const { username } = await req.json();

    if (!username)
      return NextResponse.json(
        { success: false, message: "Please provide a username" },
        { status: 400 }
      );

    const user = await User.findOne({ username }).select("username createdAt");

    if (!user)
      return NextResponse.json(
        {
          success: false,
          message: `account with username '${username}' does not exist`,
        },
        { status: 404 }
      );

    const userId = user._id.toString();

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
    console.log("Line Chart: ", Date.now() - start);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
