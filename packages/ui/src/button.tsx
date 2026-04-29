"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  onClick?: () => void;
}

export const Button = ({
  children,
  className,
  appName,
  variant = "primary",
  onClick,
}: ButtonProps) => {
  const variantStyles: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      className={[
        "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick ?? (appName ? () => alert(`Hello from your ${appName} app!`) : undefined)}
    >
      {children}
    </button>
  );
};
