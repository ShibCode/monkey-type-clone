import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const username = await req.json();
    const exists = await User.findOne({ username });
    return NextResponse.json({
      success: true,
      exists: exists ? true : false,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
}
