import type { Metadata } from "next";
 
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
      <body>
        {children}
      </body>
    </html>
  );
}
