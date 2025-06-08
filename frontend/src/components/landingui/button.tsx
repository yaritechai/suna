"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const Button = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient" | "yellow";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles = cn(
    "px-6 py-3 flex rounded-full text-sm font-semibold relative",
    "cursor-pointer hover:-translate-y-1 transition-all duration-200",
    "inline-flex items-center justify-center border-0", 
    "shadow-lg hover:shadow-xl",
    "focus:outline-none focus:ring-4 focus:ring-yellow-400/20"
  );

  const variantStyles = {
    primary: cn(
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold",
      "hover:from-yellow-300 hover:to-orange-400",
      "shadow-lg hover:shadow-xl",
      "!border-0"
    ),
    secondary: cn(
      "bg-transparent border border-yellow-400/50 text-yellow-400",
      "hover:bg-yellow-400/10 hover:border-yellow-400"
    ),
    dark: cn(
      "bg-gray-900 text-white border border-gray-700",
      "hover:bg-gray-800 hover:border-gray-600"
    ),
    gradient: cn(
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold",
      "hover:from-yellow-300 hover:to-orange-400",
      "shadow-lg hover:shadow-xl",
      "!border-0"
    ),
    yellow: cn(
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold",
      "hover:from-yellow-300 hover:to-orange-400",
      "shadow-lg hover:shadow-xl",
      "!border-0"
    ),
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}; 