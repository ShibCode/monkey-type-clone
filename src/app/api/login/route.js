import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req, res) {
  await dbConnect();
  const { email, password } = await req.json();
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return NextResponse.json({
      message: "Invalid credentials",
      success: false,
    });
  }

  const isSamePass = await bcrypt.compare(password, existingUser.password);

  if (!isSamePass) {
    return NextResponse.json({
      message: "Invalid credentials",
      success: false,
    });
  }

  return NextResponse.json({
    message: "User successfully logged in",
    success: true,
    user: { username: existingUser.username, email },
  });
}
