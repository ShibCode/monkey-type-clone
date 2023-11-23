import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import getDate from "@/utils/getDate";
import getTime from "@/utils/getTime";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { email, testData } = await req.json();

    const extendedTestData = {
      ...testData,
      date: getDate(),
      time: getTime(),
    };

    await User.updateOne(
      { email },
      { $push: { testHistory: { $each: [extendedTestData], $position: 0 } } }
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
