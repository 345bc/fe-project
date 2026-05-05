import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "sign-page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`$inter.variable`}>
      <body className="bg-dusty-coal flex min-h-screen  items-center justify-between">
        {children}
      </body>
    </html>
  );
}
