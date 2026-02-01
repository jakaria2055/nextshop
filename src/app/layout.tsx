import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";

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
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
          </StoreProvider>{" "}
        </Provider>
      </body>
    </html>
  );
}

// Next 1:03:00
