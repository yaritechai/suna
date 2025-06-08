"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const LogoIcon = () => (
  <Image
    src="https://rd9rzh3qxh.ufs.sh/f/NUZrLWPd7wqS8q3nT4H0u2mQZfzoDwFiTjAaNkBehOYKdIX1"
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