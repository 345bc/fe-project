"use client";
import React, { useState } from "react";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("Miền Bắc");

  const categories = [
    "Miền Bắc",
    "Miền Trung",
    "Miền Đông Nam Bộ",
    "Miền Tây Nam Bộ",
    "Châu Á",
    "Châu Âu",
    "Châu Mỹ",
    "Châu Úc",
    "Châu Phi",
  ];

  return (
    <div className="container-wide w-full mx-auto py-6">
      <div className="flex items-center justify-start md:justify-center gap-x-6 md:gap-x-10 overflow-x-auto no-scrollbar w-full">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-1 pb-3 md:pb-4 text-[14px] md:text-[15px] font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0
                  ${
                    activeTab === tab
                      ? "text-primary translate-y-[-1px]"
                      : "text-gray-500 hover:text-primary/70"
                  }
                `}
          >
            {tab}

            <div
              className={`absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full transition-all duration-300
                  ${activeTab === tab ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                `}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
