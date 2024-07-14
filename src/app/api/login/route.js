import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const invalidCredentials = () => {
  return NextResponse.json({
    success: false,
    message: "Invalid credentials!",
  });
};

export async function POST(req, res) {
  await dbConnect();
  const { email, password } = await req.json();
  const existingUser = await User.findOne({ email });

  if (!existingUser) return invalidCredentials();

  const isSamePass = await bcrypt.compare(password, existingUser.password);

  if (!isSamePass) return invalidCredentials();

  return NextResponse.json({
    message: "Logged in",
    success: true,
    user: { id: existingUser._id, username: existingUser.username },
  });
}
