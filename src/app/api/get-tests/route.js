import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { userId, sortingCriteria, totalCurrentTests, type } =
      await req.json();

    const sort = { [sortingCriteria.field]: sortingCriteria.order };

    const tests = await Test.find({ userId })
      .sort(sort)
      .skip(totalCurrentTests)
      .limit(10);

    const isMoreTests =
      type === "LOAD"
        ? (await Test.countDocuments({ userId })) > totalCurrentTests + 10
        : undefined;

    return NextResponse.json({ success: true, tests, isMoreTests });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
