import { NextResponse } from "next/server";
import User from "@/models/User";
import crypto from "crypto";
import connect_db from "@/lib/db";
import { verify_token, sign_token } from "@/lib/auth";
import { cookies } from "next/headers";
import send_verification_email from "@/utils/send-verification-email";
export async function POST(request) {
  try {
    await connect_db();
    const { name, email, password, password_confirmation } =
      await request.json();
    if (!name || !email || !password || !password_confirmation)
      return NextResponse.json(
        { success: false, message: "Please Provide All Fields" },
        { status: 400 }
      );
    if (password !== password_confirmation)
      return NextResponse.json(
        { success: false, message: "Passwords Donot Match" },
        { status: 400 }
      );

    const existing_user = await User.findOne({ email });
    if (existing_user)
      return NextResponse.json(
        { message: "User Already Exists" },
        { status: 400 }
      );
    const verification_token = await crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      name,
      email,
      password,
      verification_token,
    });
    const token = sign_token({
      id: user._id,
      role: user.role,
      email: user.email,
    });
    const response = await NextResponse.json({
      success: true,
      message:
        "User Registered Successfully. Please Check Your Email To Verify Your Account",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    await send_verification_email(user);
    return response;
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    } else {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Server Error" },
        { status: 400 }
      );
    }
  }
}
