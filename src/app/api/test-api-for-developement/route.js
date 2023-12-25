import TestStarted from "@/context/TestStarted";
import { Test } from "@/model/test";
import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    // const startTime = new Date();

    // const endTime = new Date();
    // const executionTime = endTime - startTime;

    const users = await User.find({ email: "shoaibafzaal1234@gmail.com" });

    return NextResponse.json({ users });
  } catch (e) {
    console.log(e);
  }
}
