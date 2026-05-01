"use client";
import React from "react";

const AuthInput = ({ label, type, placeholder, rightLabel }: any) => (
  <div className="space-y-2 py-2">
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] py-2 uppercase tracking-widest font-black text-primary">
        {label}
      </label>
      {rightLabel}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
    />
  </div>
);

export default AuthInput;
