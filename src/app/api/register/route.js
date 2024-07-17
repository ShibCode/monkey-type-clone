import dbConnect from "@/utils/dbConn";
import { User } from "@/model/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const returnInvalid = () => {
  return NextResponse.json({
    success: false,
    message: "Registration failed!",
  });
};

export async function POST(req, res) {
  try {
    await dbConnect();

    const usernameFormat = /^[a-zA-Z-_0-9]+$/;
    const passwordFormat = /(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
    const emailFormat = /^[^\s@]+@[a-zA-Z-]+\.[a-zA-Z]{2,}$/;

    const { username, email, password, verifyEmail, verifyPassword } =
      await req.json();

    // if any fields are empty
    if (!username || !email || !password || !verifyEmail || !verifyPassword)
      return returnInvalid();

    if (email !== verifyEmail || password !== verifyPassword)
      return returnInvalid(); // if email or password do not match
    if (!usernameFormat.test(username) || username.length > 16)
      return returnInvalid(); // username validation
    if (password.length < 8 || !passwordFormat.test(password))
      return returnInvalid(); // password validation
    if (!emailFormat.test(email)) return returnInvalid(); // email validation

    const hashedPass = await bcrypt.hash(password, 10);

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return NextResponse.json({
        message: "Username already exists!",
        success: false,
      });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return NextResponse.json({
        message: "Email is already registered!",
        success: false,
      });
    }

    const createdUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

    const token = await createdUser.generateToken();

    return NextResponse.json({
      message: "Account registered!",
      success: true,
      user: { _id: createdUser._id, username, email },
      token,
    });
  } catch (e) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    });
  }
}
