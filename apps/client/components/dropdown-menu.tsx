"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Dropdown from "./drop-down";
import { motion, AnimatePresence } from "framer-motion";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

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
        className={`relative uppercase group hover:text-blue-500 ${isOpen ? "text-blue-500" : ""}`}
      >
        Điểm đến
        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full ${isOpen ? "bg-blue-500 w-full" : ""}`}></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed top-17 left-0 w-screen z-50 overflow-hidden"
          >
            <Dropdown />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
