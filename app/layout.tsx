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
      <head><meta name="google-site-verification" content="Iab_B8KLg8GTTYUZmdmup7e6sU0unMpYrm6hxTidWuE" /></head>
      <Context>
        <body>
          {children}
        </body>
      </Context>
    </html>
  );
}
