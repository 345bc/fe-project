import React from "react";

interface SearchFieldProps {
  label: string;
  placeholder: string;
  isSelect?: boolean;
}

const SearchField = ({
  label,
  placeholder,
  isSelect = false,
}: SearchFieldProps) => (
  <div className="px-6 py-2 flex flex-col gap-1 cursor-pointer hover:bg-gray-50 transition-colors group">
    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
      {label}
    </span>
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm truncate">{placeholder}</span>
      {isSelect && (
        <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 transition-colors">
          expand_more
        </span>
      )}
    </div>
  </div>
);

export default SearchField;
