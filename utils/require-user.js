import get_user from "./get-user";
export default async function require_user() {
    const user = await get_user()
    if (!user) return null
    return user
}