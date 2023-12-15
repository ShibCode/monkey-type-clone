import TestStarted from "@/context/TestStarted";
import { Test } from "@/model/test";
import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const outputs = await Test.find({}).sort({ createdAt: -1 });
    return NextResponse.json({
      outputs,
    });
  } catch (e) {
    console.log(e);
  }
}
