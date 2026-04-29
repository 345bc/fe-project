import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "ZTravel - Nền tảng du lịch thông minh cho mọi hành trình",
  description:
    "Trải nghiệm du lịch thông minh với thông tin hữu ích, địa điểm đẹp và dịch vụ tiện lợi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                🛒 MyShop
              </Link>
              <nav className="flex gap-6">
                <Link href="/" className="hover:text-blue-600">
                  Trang chủ
                </Link>
                <Link href="/products" className="hover:text-blue-600">
                  Sản phẩm
                </Link>
                <Link
                  href="http://localhost:3001"
                  className="hover:text-blue-600"
                >
                  🔐 Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>© 2024 MyShop. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
