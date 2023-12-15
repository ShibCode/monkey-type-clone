import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { userId, sortingCriteria } = await req.json();

    let field = "";
    let order = "";

    if (sortingCriteria.field === "date") field = "createdAt";
    else field = sortingCriteria.field;

    if (sortingCriteria.order === "ascending") order = 1;
    else order = -1;

    const tests = await Test.find({ userId })
      .sort({ [field]: order })
      .limit(10);

    const isMoreTests = (await Test.countDocuments()) > 10;

    return NextResponse.json({ success: true, tests, isMoreTests });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
