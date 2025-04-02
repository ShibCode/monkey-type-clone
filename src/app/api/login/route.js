import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const invalidCredentials = () => {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid credentials!",
    },
    { status: 401 }
  );
};

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    if (!existingUser) return invalidCredentials();

    const isSamePass = await bcrypt.compare(password, existingUser.password);

    if (!isSamePass) return invalidCredentials();

    const token = await existingUser.generateToken();

    return NextResponse.json({
      message: "Logged in",
      success: true,
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email,
        createdAt: existingUser.createdAt,
      },
      token,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
