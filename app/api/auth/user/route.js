import get_user from "@/utils/get-user";
import { NextResponse } from "next/server";
export async function GET() {
  const user = await get_user()
  if (!user) return NextResponse.json({ success: false, message: "User Not Found or Invalid Token" }, { status: 400 })
  return NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role, is_verified: user.is_verified, avatar: user.avatar } }, { status: 200 })
}