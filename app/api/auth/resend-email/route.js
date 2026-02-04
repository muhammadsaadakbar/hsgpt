import User from "@/models/User";
import connect_db from "@/lib/db";
import crypto from "crypto";
import send_verification_email from "@/utils/send-verification-email";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const { email } = await request.json();
    await connect_db();
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    if (user.is_verified)
      return NextResponse.json(
        { success: false, message: "User Already Verified" },
        { status: 400 }
      );
    user.verification_token = await crypto.randomBytes(32).toString("hex");
    await user.save();
    await send_verification_email(user);
    return NextResponse.json(
      { success: true, message: "Verification Email sent again" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
