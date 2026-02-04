import { NextResponse } from "next/server";
import User from "@/models/User";
import connect_db from "@/utils/db";
import { OAuth2Client } from "google-auth-library";
import { sign_token } from "@/utils/auth";

export const runtime = "nodejs";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function GET(req: Request) {
    try {
        await connect_db();

        // ✅ Get code from URL
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.json(
                { success: false, message: "No code provided" },
                { status: 400 }
            );
        }

        // ✅ Exchange code for tokens
        const { tokens } = await client.getToken(code);

        client.setCredentials(tokens);

        // ✅ Get user info from Google
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json(
                { success: false, message: "Invalid Google payload" },
                { status: 401 }
            );
        }

        const { sub: google_id, email, name, picture } = payload;

        // ✅ Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                google_id,
                avatar: picture,
                is_verified: true,
                email_verified_at: new Date(),

                // required by schema
                password: google_id,
            });
        }

        // ✅ Create JWT
        const jwt_token = sign_token({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        // ✅ Redirect response
        const response = NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        );

        // ✅ Set cookie
        response.cookies.set("token", jwt_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error: any) {
        console.error("Google Redirect Login Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Google Login Failed",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
