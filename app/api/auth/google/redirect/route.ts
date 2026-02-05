import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const googleUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
 
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

  return NextResponse.redirect(googleUrl);
}
