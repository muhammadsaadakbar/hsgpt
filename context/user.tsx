"use client";

import { createContext, useContext, useState, useEffect } from "react";

/* -----------------------------
   User Type (based on schema)
------------------------------ */
export type UserType = {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    avatar?: string | null;
    is_verified: boolean;
    email_verified_at?: string | null;
};

/* -----------------------------
   Context Type
------------------------------ */
type UserContextType = {
    user: UserType | null;
    loading: boolean;
    setUser: (user: UserType | null) => void;
    logout: () => void;
};

/* -----------------------------
   Create Context
------------------------------ */
const UserContext = createContext<UserContextType | null>(null);

/* -----------------------------
   Provider Component
------------------------------ */
export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    // Auto-load user session from API
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/user");

                if (!res.ok) {
                    setUser(null);
                } else {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.log("User fetch error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

       const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
      };

    return (
        <UserContext.Provider value={{ user, loading, setUser,logout }}>
            {children}
        </UserContext.Provider>
    );
}

/* -----------------------------
   Custom Hook
------------------------------ */
export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used inside UserProvider");
    }

    return context;
}
