"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
interface props {
  isScrolled: boolean;
}

export default function UserMenu({ isScrolled }: props) {
  const { user, handleLogout } = useAuth();

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
          isScrolled ? "text-gray-700" : "text-white"
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">person</span>
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md transition ${
          isScrolled ? "bg-gray-100 text-gray-800" : "bg-white/10 text-white"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
          {user.sub?.charAt(0).toUpperCase()}
        </div>

        <span className="hidden md:block text-sm">{user.sub}</span>
      </button>

      <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <Link href="/profile" className="block px-4 py-3 hover:bg-gray-50">
          Hồ sơ
        </Link>
        <Link href="/bookings" className="block px-4 py-3 hover:bg-gray-50">
          Đơn đặt tour
        </Link>
        <Link href="/wishlist" className="block px-4 py-3 hover:bg-gray-50">
          Yêu thích
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-500"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
