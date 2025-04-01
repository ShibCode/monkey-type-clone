import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { connection: db } = await dbConnect();

    const { mode } = await req.json();

    const collection = db.collection(mode);

    const data = await collection.find({}).toArray();

    return NextResponse.json({ success: true, leaderboardsData: data });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
}
