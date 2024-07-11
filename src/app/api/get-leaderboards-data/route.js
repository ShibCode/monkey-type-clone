import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const categories = [
      { text: "Words 10", mode: { name: "words", category: 10 } },
      { text: "Words 25", mode: { name: "words", category: 25 } },
      { text: "Words 50", mode: { name: "words", category: 50 } },
      { text: "Words 100", mode: { name: "words", category: 100 } },
      { text: "Time 15", mode: { name: "time", category: 15 } },
      { text: "Time 30", mode: { name: "time", category: 30 } },
      { text: "Time 60", mode: { name: "time", category: 60 } },
      { text: "Time 120", mode: { name: "time", category: 120 } },
    ];

    const { category } = await req.json();

    const activeCategory = categories.find((c) => c.text === category);

    if (!activeCategory) {
      return NextResponse.json({
        success: false,
        message: "Invalid category",
      });
    }

    const top10 = await Test.aggregate([
      // Match documents with the specified mode.name and mode.category
      {
        $match: {
          "mode.name": activeCategory.mode.name,
          "mode.category": activeCategory.mode.category,
        },
      },
      // Sort by userId and wpm in descending order
      { $sort: { userId: 1, wpm: -1 } },
      // Group by userId and take the first document in each group (the one with the highest wpm)
      { $group: { _id: "$userId", fastestTest: { $first: "$$ROOT" } } },
      // Replace the root with the fastestTest document
      { $replaceRoot: { newRoot: "$fastestTest" } },
      // Lookup user details from the User collection
      {
        $lookup: {
          from: "users", // The collection where user details are stored
          localField: "userId", // The field from the Test collection
          foreignField: "_id", // The field from the User collection
          as: "userDetails", // The name of the field where the user details will be added
        },
      },
      // Unwind the userDetails array to get a single user document
      { $unwind: "$userDetails" },
      // Optionally, sort by wpm in descending order
      { $sort: { wpm: -1 } },
    ]);

    return NextResponse.json({ success: true, leaderboardsData: top10 });
  } catch (e) {
    NextResponse.json({ success: false, message: "Something went wrong!" });
  }
}
