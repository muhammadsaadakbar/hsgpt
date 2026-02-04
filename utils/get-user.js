import connect_db from "./db";
import { cookies } from "next/headers"
import User from "@/models/User";
import { verify_token } from "./auth";
export default async function get_user() {
    const cookie_store = await cookies()
    const token = cookie_store.get("token")?.value
    if (!token) return null
    const payload = await verify_token(token)
    if (!payload.id) return null
    await connect_db()
    const user = await User.findById(payload.id)
    if (!user) return null
    return user
}