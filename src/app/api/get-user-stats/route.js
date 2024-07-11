import { Test } from "@/model/test";
import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import getBestTests from "./getBestTests";
import getAllTimeStats from "./getAllTimeStats";
import getLineChartData from "./getLineChartData";
import getBarChartData from "./getBarChartData";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { userId } = await req.json();

    const tests = await Test.find({ userId }).sort({ createdAt: "descending" });

    const seconds = tests.reduce((acc, test) => acc + test.timeTaken, 0); // gets total seconds typed
    const timeTyping = new Date(seconds * 1000).toISOString().slice(11, 19); // converts seconds into formatted time

    const bestTests = await getBestTests(tests); // gets best tests in each mode and category
    const allTimeStats = getAllTimeStats(tests, timeTyping); // gets the general best and average stats
    const lineChartData = getLineChartData(tests); // getting line chart data
    const barChartData = getBarChartData(tests); // getting bar chart data

    return NextResponse.json({
      bestTests,
      timeTyping,
      totalTestsCompleted: tests.length,
      isMoreTests: tests.length > 10,
      tests: tests.reverse().slice(0, 10),
      allTimeStats,
      lineChartData,
      barChartData,
    });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" });
  }
}
