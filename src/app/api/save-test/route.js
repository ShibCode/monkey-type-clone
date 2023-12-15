import { User } from "@/model/user";
import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { email, testData } = await req.json();

    const { _id: userId } = await User.findOne({ email }, { _id: 1 });

    const bestTestInCategory = await Test.findOne({
      userId,
      mode: testData.mode,
    })
      .sort({ wpm: -1 })
      .limit(1);

    const getIsPersonalBest = () => {
      if (bestTestInCategory) return testData.wpm > bestTestInCategory.wpm;
      return true;
    };

    const isPersonalBest = getIsPersonalBest();

    const test = new Test({
      userId,
      ...testData,
      isPersonalBest,
    });

    await test.save();

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
