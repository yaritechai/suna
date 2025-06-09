"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const LogoIcon = () => (
  <Image
    src="/logo.svg"
    alt="Yari Logo"
    width={32}
    height={32}
    className="w-8 h-8"
  />
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