"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Dropdown from "./abc";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Đóng dropdown khi bắt đầu chuyển trang
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    // Next.js App Router không có router.events, dùng pathname effect
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative transition-colors duration-500" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative uppercase group hover:text-blue-500"
      >
        Điểm đến
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
      </button>

      {isOpen && (
        <div className="fixed top-18 left-0 w-screen border-zinc-400/50 z-50">
          <Dropdown />
        </div>
      )}
    </div>
  );
}
