import { NextResponse } from "next/server";
import User from "@/models/User";
import connect_db from "@/lib/db";
import { hash_token } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { token, password, password_confirmation } = body;

  // Basic validation
  if (!token || !password || !password_confirmation) {
    return NextResponse.json(
      { success: false, message: "Please provide all required fields" },
      { status: 400 }
    );
  }

  if (password !== password_confirmation) {
    return NextResponse.json(
      { success: false, message: "Passwords do not match" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { success: false, message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  try {
    await connect_db();

    const hashed_token = hash_token(token);

    const user = await User.findOne({
      reset_password_token: hashed_token,
      reset_password_expire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update password
    user.password = password; // ensure hashing in User model
    user.reset_password_token = undefined;
    user.reset_password_expire = undefined;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password Reset Error: ", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
