import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const { _id, totalCurrentTests } = await req.json();

    const { _doc: user } = await User.findOne(
      { _id },
      { testHistory: { $slice: totalCurrentTests + 10 } }
    );

    return NextResponse.json({ testHistory: user.testHistory });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" });
  }
}
