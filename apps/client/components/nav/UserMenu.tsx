"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
// interface props {
//   isScrolled: boolean;
// }

// export default function UserMenu({ isScrolled }: props) {
export default function UserMenu() {
  const { user, handleLogout } = useAuth();

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className=" p-2 rounded-full hover:bg-zinc-400 transition-colors duration-500 text-primary"
      >
        <span className="material-symbols-outlined">person</span>
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-ghostwhite shadow-xl text-primary">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
          {user.sub?.charAt(0).toUpperCase()}
        </div>

        <span className="hidden md:block text-sm">{user.sub}</span>
      </button>

      <div className="absolute left-0 mt-3 w-52 bg-white rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
