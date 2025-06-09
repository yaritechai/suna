'use client';

import Image from 'next/image';

interface KortixLogoProps {
  size?: number;
}
export function KortixLogo({ size = 24 }: KortixLogoProps) {
  return (
    <Image
      src="https://rd9rzh3qxh.ufs.sh/f/NUZrLWPd7wqS8q3nT4H0u2mQZfzoDwFiTjAaNkBehOYKdIX1"
      alt="Yari"
      width={size}
      height={size}
      className="flex-shrink-0"
    />
  );
}
