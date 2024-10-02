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

  const token = await existingUser.generateToken();

  // Create a new Date object
  const date = new Date(existingUser.createdAt);

  // Format the date
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return NextResponse.json({
    message: "Logged in",
    success: true,
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email,
      createdAt: formattedDate,
    },
    token,
  });
}
