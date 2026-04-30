import React from "react";

interface TabItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

const TabItem = ({ icon, label, active = false }: TabItemProps) => (
  <div
    className={`flex items-center gap-2 cursor-pointer whitespace-nowrap pb-2 border-b-2 transition-all 
    ${
      active
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-blue-500"
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

export default TabItem;
