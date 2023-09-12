import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { email, testData } = await req.json();

    await User.updateOne(
      { email },
      { $push: { testHistory: { $each: [testData], $position: 0 } } }
    );

    return NextResponse.json({
      message: "Stats successfully updated",
      success: true,
    });
  } catch (e) {
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
    });
  }
}
