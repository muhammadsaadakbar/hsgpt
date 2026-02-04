import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET(request) {
  try {
    const response = await NextResponse.json(
      { success: true, message: "Logout Successful" },
      { status: 201 }
    );
    response.cookies.delete("token");
    return response;
  } catch (error) {
    console.error("Logout Error: ", error);
    return NextResponse.json(
      { success: true, message: "Server Error Please Try Again Later" },
      { status: 500 }
    );
  }
}
