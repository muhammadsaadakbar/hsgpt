"use client"
import { UserProvider } from "./user"
export default function Context({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>{children}</UserProvider>
    )
}