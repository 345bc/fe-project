"use client";
import React, { ReactNode } from "react";

interface AuthInputProps {
  name?: string;
  label: string;
  type: string;
  placeholder: string;
  rightLabel?: ReactNode;
}

const AuthInput = ({
  name,
  label,
  type,
  placeholder,
  rightLabel,
}: AuthInputProps) => (
  <div className="space-y-0.5 ">
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] py-2 uppercase tracking-widest font-black text-primary">
        {label}
      </label>
      {rightLabel}
    </div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
    />
  </div>
);

export default AuthInput;
