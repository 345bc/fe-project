import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "@/app/globals.css";
import LogoutButton from "@/components/logout-button";
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
        <div className="flex min-h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="w-64 bg-white-smoke border-r border-gray-200 flex flex-col">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <span className="text-lg font-semibold text-gray-900">
                Admin Panel
              </span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-6">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Quản lý
              </p>

              <div className="space-y-1">
                <Link
                  href="/"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700
                   hover:bg-gray-100 hover:text-gray-900
                   border-l-4 border-transparent hover:border-gray-300"
                >
                  Dashboard
                </Link>

                <Link
                  href="/users"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700
                   hover:bg-gray-100 hover:text-gray-900
                   border-l-4 border-transparent hover:border-gray-300"
                >
                  Tài khoản và người dùng
                </Link>

                <Link
                  href="/products"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700
                   hover:bg-gray-100 hover:text-gray-900
                   border-l-4 border-transparent hover:border-gray-300"
                >
                  Products
                </Link>
              </div>

              <div className="mt-8">
                <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Khác
                </p>

                <Link
                  href="http://localhost:3000"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700
                   hover:bg-gray-100 hover:text-gray-900"
                >
                  Về Website
                </Link>
              </div>
            </nav>

            {/* Footer sidebar */}
            <div className="border-t border-gray-200 px-6 py-4 text-xs text-gray-500">
              © 2026 Admin System
            </div>
          </aside>
          {/* Main area */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                Trang quản trị
              </span>

              <LogoutButton />
            </header>

            {/* Content */}
            <main className="flex-1 p-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
