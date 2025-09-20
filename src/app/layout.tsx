import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { UserContextProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "RLS Guard Dog",
  description: "Supabase RLS demo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <UserContextProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </UserContextProvider>
      </body>
    </html>
  );
}
