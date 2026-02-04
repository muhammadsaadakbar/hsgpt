import { NextResponse } from "next/server";
import User from "@/models/User";
import connect_db from "@/lib/db";
import { OAuth2Client } from "google-auth-library";
import { sign_token } from "@/lib/auth";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request) {
  try {
    await connect_db();
    const { token } = await request.json();
    if (!token)
      return NextResponse.json(
        { success: false, message: "No Google Token Provided" },
        { status: 400 }
      );

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: google_id, email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        google_id,
        is_verified: true,
        email_verified_at: new Date(),
        avatar: picture,
        password: Math.random().toString(36).slice(-8),
      });
    }
    const jwt_token = sign_token({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    const response = await NextResponse.json(
      {
        success: true,
        message: "Google Login Successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      },
      { status: 201 }
    );
    response.cookies.set({
      name: "token",
      value: jwt_token,
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("Google Login Error: ", error);
    return NextResponse.json(
      { success: false, message: "Google Login Failed", error: error.message },
      { status: 500 }
    );
  }
}
