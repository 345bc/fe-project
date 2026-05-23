"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  id: number;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (option: any) => void;
  className?: string;
  multiple?: boolean;
  value?: any;
}

export default function CustomSelect({
  options,
  placeholder = "Chọn điểm đến",
  onChange,
  className = "",
  multiple = false,
  value,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSingle, setSelectedSingle] = useState<Option | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đồng bộ giá trị chọn từ bên ngoài (Controlled Component)
  useEffect(() => {
    if (value !== undefined) {
      if (multiple) {
        setSelectedMultiple(value || []);
      } else {
        setSelectedSingle(value || null);
      }
    }
  }, [value, multiple]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset tìm kiếm khi đóng dropdown
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSelectSingle = (option: Option) => {
    setSelectedSingle(option);
    setIsOpen(false);
    onChange?.(option);
  };

  const handleToggleMultiple = (option: Option) => {
    let newSelected: Option[];
    if (selectedMultiple.some(item => item.id === option.id)) {
      newSelected = selectedMultiple.filter(item => item.id !== option.id);
    } else {
      newSelected = [...selectedMultiple, option];
    }
    setSelectedMultiple(newSelected);
    onChange?.(newSelected);
  };

  const filteredOptions = (options || []).filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSelection = multiple ? selectedMultiple.length > 0 : !!selectedSingle;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Button trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-4xl  px-4 py-4 text-sm font-normal text-text-primary outline-none transition ${isOpen ? "bg-surface border-[0.5px]" : "bg-zinc-100"}`}
      >
        <span className={!hasSelection ? "text-gray-400 font-sans tracking-wide truncate pr-2 text-left w-full" : "font-sans tracking-wide truncate pr-2 text-left w-full"}>
          {multiple
            ? (selectedMultiple.length > 0 ? selectedMultiple.map(o => o.name).join(", ") : placeholder)
            : (selectedSingle ? selectedSingle.name : placeholder)
          }
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2  max-h-60 overflow-auto no-scrollbar rounded-xl border border-slate-200 bg-white pb-2 shadow-lg">
          <div className="  bg-surface shadow-sm   sticky top-0 p-2">
            <div className="flex items-center rounded-4xl font-sans text-sm border border-slate-200 font-normal text-text-secondary py-2 px-3 mx-2 bg-zinc-50 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
              <span className="material-symbols-outlined mr-2 text-slate-400 shrink-0 select-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full bg-transparent outline-none text-text-primary placeholder:text-gray-400 text-sm font-sans"
                onClick={(e) => e.stopPropagation()} // Tránh click làm đóng menu
              />
            </div>
          </div>
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">Không tìm thấy kết quả</div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = multiple
                ? selectedMultiple.some(item => item.id === option.id)
                : selectedSingle?.id === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => multiple ? handleToggleMultiple(option) : handleSelectSingle(option)}
                  className={`flex items-center w-full px-4 py-3 text-left text-sm transition hover:bg-zinc-50 ${
                    isSelected ? "bg-primary/5 text-primary font-medium" : "text-text-primary"
                  }`}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mr-3 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer shrink-0"
                    />
                  )}
                  <span className="truncate">{option.name}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
