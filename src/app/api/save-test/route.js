import { User } from "@/model/user";
import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { userId, testData } = await req.json();

    // check if wpm * 5 * (4.25 / 60) approximately equals 'correct'
    const isCorrect =
      Math.abs(
        testData.correct - testData.wpm * 5 * (testData.timeTaken / 60)
      ) < 0.01 &&
      Math.abs(
        testData.correct +
          testData.incorrect -
          testData.raw * 5 * (testData.timeTaken / 60)
      ) < 0.01;

    if (!isCorrect) {
      return NextResponse.json({ message: "Invalid data", success: false });
    }

    const bestTestInCategory = await Test.findOne({
      userId,
      mode: testData.mode,
      language: testData.language,
    })
      .sort({ wpm: -1 })
      .limit(1);

    const getIsPersonalBest = () => {
      if (bestTestInCategory) return testData.wpm > bestTestInCategory.wpm;
      return true;
    };

    const isPersonalBest = getIsPersonalBest();

    Test.insertMany([{ userId, ...testData, isPersonalBest }]);

    return NextResponse.json({
      message: "Stats successfully updated",
      success: true,
      isPersonalBest,
    });
  } catch (e) {
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
    });
  }
}
