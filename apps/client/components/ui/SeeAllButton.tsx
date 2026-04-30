"use client";
import Link from "next/link";
import React from "react";

interface SeeAllButtonProps {
  href: string;
  label?: string;
  className?: string;
}

const SeeAllButton = ({
  href,
  label = "Xem tất cả",
  className = "",
}: SeeAllButtonProps) => {
  return (
    <div className={`flex justify-center mt-10 ${className}`}>
      <Link
        href={href}
        className="group flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary font-bold rounded-full transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 shadow-sm hover:shadow-md"
      >
        <span>{label}</span>

        <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-1">
          arrow_forward
        </span>
      </Link>
    </div>
  );
};

export default SeeAllButton;
