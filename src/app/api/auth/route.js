import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization").split(" ")[1];

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return NextResponse.json({
      success: true,
      message: "Authenticated",
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Not authenticated",
    });
  }
}
