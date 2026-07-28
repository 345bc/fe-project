import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";
import Footer from "@/components/Footer";
import NavbarMain from "@/components/navbar";

export const metadata: Metadata = {
  title: "ZTravel - Nền tảng du lịch thông minh cho mọi hành trình",
  description:
    "Trải nghiệm du lịch thông minh với thông tin hữu ích, địa điểm đẹp và dịch vụ tiện lợi.",
  icons: { icon: "/globe.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className=" text-on-surface font-body antialiased">
        {/* Nav */}
        <NavbarMain />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
