import dbConnect from "@/utils/dbConn";
import { User } from "@/model/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req, res) {
  try {
    await dbConnect();
    const { username, email, password } = await req.json();

    const hashedPass = await bcrypt.hash(password, 10);

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return NextResponse.json({
        message: "Username already exists",
        success: false,
      });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return NextResponse.json({
        message: "E-mail is already registered",
        success: false,
      });
    }

    await User.create({
      username,
      email,
      password: hashedPass,
    });

    return NextResponse.json({
      message: "User successfully registered",
      success: true,
      user: {
        username,
        email,
      },
    });
  } catch (e) {
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
    });
  }
}
