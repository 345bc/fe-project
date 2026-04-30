"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Gọi ngay lập tức để đồng bộ với scroll position hiện tại
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/70 backdrop-blur-2xl shadow-[0_2px_20px_rgba(0,0,0,0.05)] py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="flex justify-between items-center container-main mx-auto md:px-12">
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${
            isScrolled ? "text-[#13357B]" : "text-white"
          }`}
        >
          ZTRAVEL
        </Link>

        {/* Menu Links */}
        <div
          className={`hidden md:flex gap-10 font-medium text-sm uppercase tracking-widest transition-colors duration-300 ${
            isScrolled ? "text-gray-700" : "text-white/90"
          }`}
        >
          {["Destinations", "Tours", "Cruises", "Offers"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="hover:text-blue-500 transition-colors relative group"
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              search
            </span>
          </button>

          <button
            className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              person
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
