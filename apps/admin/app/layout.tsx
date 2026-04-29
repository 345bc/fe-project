import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Quản trị hệ thống",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="flex h-screen">
          <aside className="w-64 bg-gray-900 text-white">
            <div className="p-4 border-b border-gray-700">
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="p-4 space-y-2">
              <Link href="/" className="block p-2 hover:bg-gray-800 rounded">
                📊 Dashboard
              </Link>
              <Link
                href="/users"
                className="block p-2 hover:bg-gray-800 rounded"
              >
                👥 Users
              </Link>
              <Link
                href="/products"
                className="block p-2 hover:bg-gray-800 rounded"
              >
                🛍️ Products
              </Link>
              <Link
                href="http://localhost:3000"
                className="block p-2 hover:bg-gray-800 rounded"
              >
                🌐 Về Website
              </Link>
            </nav>
          </aside>
          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Trang quản trị</h2>
              <button className="text-red-600">Đăng xuất</button>
            </header>
            <main className="flex-1 overflow-auto p-6 bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
