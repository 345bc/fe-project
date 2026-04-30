"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Gọi ngay lập tức để đồng bộ với scroll position hiện tại
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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

        {/* Action Buttons & Mobile Menu */}
        <div className="flex items-center gap-1 md:gap-3">
          <button
            className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[22px]">
              search
            </span>
          </button>

          <Link
            href="/login"
            className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            aria-label="User Profile"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[22px]">
              person
            </span>
          </Link>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`md:hidden p-2 ml-1 rounded-full hover:bg-black/5 transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            aria-label="Open Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-[110] transition-transform duration-500 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-6 border-b border-gray-100">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-black tracking-tighter text-[#13357B]"
          >
            ZTRAVEL
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            aria-label="Close Menu"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>

        <div className="flex flex-col px-6 py-10 gap-8 overflow-y-auto">
          {["Destinations", "Tours", "Cruises", "Offers"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors flex items-center justify-between group"
            >
              {item}
              <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </Link>
          ))}

          <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col gap-4">
            <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-colors">
              Đăng nhập
            </button>
            <button className="w-full py-4 bg-blue-50 text-primary rounded-2xl font-bold text-lg hover:bg-blue-100 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
