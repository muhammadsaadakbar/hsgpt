import type { Metadata } from "next";
import Context from "@/context/context";
import "./globals.css"
export const metadata: Metadata = {
  title: "HSgpt Ai",
  description: "hsgpt powered by groq ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Context>
        <body>
          {children}
        </body>
      </Context>
    </html>
  );
}
