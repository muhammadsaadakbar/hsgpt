import User from "@/models/User";
import connect_db from "@/lib/db";
import { verify_token, sign_token } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connect_db();
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { success: false, error: "Invalid Credentials" },
        { status: 401 }
      );

    const password_correct = await user.compare_password(password);
    if (!password_correct)
      return NextResponse.json(
        { success: false, error: "Invalid Credentials" },
        { status: 401 }
      );

    const token = sign_token({
      id: user._id,
      role: user.role,
      email: user.email,
    });
    const response = NextResponse.json({
      success: true,
      message: "Signed In Successfully",
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
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
