import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextShop | Just in time delivery app",
  description: "Just in time delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-blue-200 to-white">
        {children}
      </body>
    </html>
  );
}
