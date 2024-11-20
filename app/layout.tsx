import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ActiveStatus } from "./(protected)/_components/active-status";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Realtime Chat",
  description: "Realtime messaging app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          <ActiveStatus />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
