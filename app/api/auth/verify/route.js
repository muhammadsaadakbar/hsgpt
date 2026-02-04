import { NextResponse } from "next/server";
import connect_db from "@/lib/db";
import User from "@/models/User";
export async function GET(request) {
  try {
    await connect_db();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token)
      return NextResponse.json(
        { error: "Invalid OR Missing  Token" },
        { status: 400 }
      );
    const user = await User.findOne({ verification_token: token });
    if (!user)
      return NextResponse.json(
        { error: "Invalid Or Expired Token" },
        { status: 400 }
      );
    await user.verify_email();
    await user.save();
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);
  } catch (error) {
    console.error(`Error Verifying Email: ${error}`);
    return NextResponse.json(
      { error: "Error Verifying Email" },
      { status: 500 }
    );
  }
}
