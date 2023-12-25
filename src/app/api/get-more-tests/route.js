import { Test } from "@/model/test";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { userId, totalCurrentTests, sortingCriteria } = await req.json();

    let field = "";
    let order = "";

    if (sortingCriteria.field === "date") field = "createdAt";
    else field = sortingCriteria.field;

    if (sortingCriteria.order === "ascending") order = 1;
    else order = -1;

    const newTests = await Test.find({ userId })
      .sort({ [field]: order })
      .skip(totalCurrentTests)
      .limit(10);

    const isMoreTests = (await Test.countDocuments()) > totalCurrentTests + 10;

    return NextResponse.json({ newTests, isMoreTests });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" });
  }
}
