import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  return NextResponse.json({ message: "asd" });
}
