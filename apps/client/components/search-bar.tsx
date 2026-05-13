"use client";

import { useState } from "react";
import SearchField from "./ui/SearchField";

const TABS = [
  { id: "visa", icon: "local_activity", label: "Visa" },
  { id: "tour", icon: "grid_view", label: "Tour trọn gói" },
  { id: "hotel", icon: "hotel", label: "Khách sạn" },
  { id: "flight", icon: "flight", label: "Vé máy bay" },
  { id: "combo", icon: "directions_car", label: "Combo" },
  { id: "other", icon: "add_circle", label: "Dịch vụ khác" },
];

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState("tour");

  return (
    <div className="relative md:absolute md:-bottom-24 md:left-1/2 md:-translate-x-1/2 container-main w-full z-30 font-body px-4 md:px-0 -mt-20 md:mt-0">
      <div className="bg-white dark:bg-zinc-950/80 rounded-lg   shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-white/50 dark:border-zinc-800/50 p-2 md:p-4">
        <div className="flex items-center gap-1 md:gap-2  mb-2 overflow-x-auto no-scrollbar justify-start md:justify-center">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap flex-none
                  ${
                    isActive
                      ? "bg-primary text-surface font-semibold tracking-tight transition-all duration-75"
                      : " font-semibold tracking-tight hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-primary"
                  }
                `}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-sm md:rounded-full  flex flex-col md:flex-row items-center gap-2 shadow-inner border border-zinc-100 dark:border-zinc-800">
          {activeTab == "tour" && (
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 relative">
              <div className="relative group px-4 md:px-8 py-3 rounded-2xl md:rounded-full transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">location_on</span>
                  <SearchField
                    label="Điểm khởi hành"
                    type="text"
                    placeholder="Chọn điểm khởi hành..."
                  />
                </div>
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="relative group px-4 md:px-8 py-3 rounded-2xl md:rounded-full transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">location_on</span>
                  <SearchField
                    label="Điểm đến"
                    type="text"
                    placeholder="Chọn điểm đến..."
                  />
                </div>
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <div className="relative group px-4 md:px-8 py-3 rounded-2xl md:rounded-full transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>
                  <SearchField
                    label="Ngày khởi hành"
                    placeholder="Chọn ngày khởi hành"
                  />
                </div>
              </div>
            </div>
          )}
          <button
            className="
            w-full md:w-[70px] h-12 md:h-[70px] 
            bg-primary text-white rounded-2xl md:rounded-full 
            flex items-center justify-center 
            transition-all duration-300 
            hover:brightness-110 hover:shadow-xl hover:shadow-primary/40 
            active:scale-95 group shrink-0
            gap-2
          "
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110">
              search
            </span>
            <span className="block md:hidden font-bold">Tìm kiếm ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
