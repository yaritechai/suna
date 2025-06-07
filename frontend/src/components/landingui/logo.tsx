"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LogoIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
    <span className="text-black font-bold text-sm">Y</span>
  </div>
);

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex gap-2 items-center text-sm text-black px-2 py-1 shrink-0 relative z-20"
    >
      <LogoIcon />
      <span className="font-medium text-white">Yari</span>
    </Link>
  );
}; 