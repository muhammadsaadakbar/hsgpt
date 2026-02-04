import { NextResponse } from "next/server";
import connect_db from "@/lib/db";
import User from "@/models/User";
import { generate_reset_token } from "@/lib/auth";
import sendEmail from "@/utils/send-email";

export async function POST(request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Please provide an email to reset password" },
      { status: 400 }
    );
  }

  try {
    await connect_db();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist" },
        { status: 400 }
      );
    }

    // ✅ Correct destructuring
    const { token, hashed } = generate_reset_token();

    user.reset_password_token = hashed;
    user.reset_password_expire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const reset_url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    const html = `
      <h2>Hello, ${user.name}</h2>
      <p>Here is the link to reset your password for Saad Topup Store. Click the button below:</p>
      <a href="${reset_url}" style="color: white; background-color: blue; padding: 10px 20px; text-decoration: none;">Reset</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail(email, "Reset Your Password", html);

    return NextResponse.json(
      {
        success: true,
        message: "Password reset link has been sent to your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error: ", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
