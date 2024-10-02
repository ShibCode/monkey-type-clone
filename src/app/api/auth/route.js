import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization").split(" ")[1];

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Create a new Date object
    const date = new Date(user.createdAt);

    // Format the date
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return NextResponse.json({
      success: true,
      message: "Authenticated",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: formattedDate,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Not authenticated",
    });
  }
}
