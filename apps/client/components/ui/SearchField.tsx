import React from "react";

interface SearchFieldProps {
  label?: string;
  placeholder: string;
  type?: string;
}

const SearchField = ({ label, placeholder, type }: SearchFieldProps) => (
  <div className="flex flex-col gap-1 cursor-pointer  px-4">
    <div className="font-normal tracking-tight">{label}</div>
    <input
      type={type}
      placeholder={placeholder}
      className="tracking-light focus:outline-none"
    ></input>
  </div>
);

export default SearchField;
