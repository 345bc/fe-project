"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  onClose?: () => void;
}

interface SubMenuItem {
  label: string;
  href: string;
  hot?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  items: SubMenuItem[];
}

const MENU_DATA: MenuItem[] = [
  {
    id: "domestic",
    label: "Du lịch trong nước",
    items: [
      { label: "Miền Bắc", href: "#" },
      { label: "Miền Trung", href: "#" },
      { label: "Miền Nam", href: "#" },
    ],
  },
  {
    id: "international",
    label: "Du lịch nước ngoài",
    items: [
      { label: "Đông Nam Á", href: "#", hot: true },
      { label: "Châu Âu", href: "#" },
      { label: "Châu Á", href: "#" },
    ],
  },
];

export default function Dropdown({ onClose }: DropdownProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenu((prev) => (prev === id ? null : id));
  };

  return (
    <div className="grid grid-cols-2 gap-0 bg-surface max-w-2xl mx-auto">
      {MENU_DATA.map((menu) => {
        const isExpanded = openSubmenu === menu.id;

        return (
          <div key={menu.id} className="relative">
            <div
              role="button"
              aria-haspopup="true"
              aria-expanded={isExpanded}
              tabIndex={0}
              onClick={() => toggleSubmenu(menu.id)}
              onKeyDown={(e) => e.key === "Enter" && toggleSubmenu(menu.id)}
              className="flex items-center justify-between p-2 gap-1 cursor-pointer rounded-xl transition-all duration-300 hover:shadow-md hover:bg-zinc-200/10 group"
            >
              <span
                className={`text-sm font-normal tracking-tight transition-colors duration-200 ${
                  isExpanded ? "text-primary" : "text-zinc-400 group-hover:text-primary"
                }`}
              >
                {menu.label}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-all duration-300 ${
                  isExpanded
                    ? "rotate-180 text-blue-500"
                    : "text-gray-400 group-hover:text-blue-500"
                }`}
              />
            </div>

            {/* Sub-menu panel */}
            <div
              className={`absolute top-full left-0 w-48 bg-surface shadow-xl rounded-b-xl z-50 overflow-hidden transition-all duration-300 ${
                isExpanded
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-1"
              }`}
              role="menu"
            >
              <div className="p-2">
                {menu.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    role="menuitem"
                    onClick={onClose}
                    className="block p-2 text-sm text-primary hover:bg-zinc-400/20 rounded-xl transition-colors duration-100"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
