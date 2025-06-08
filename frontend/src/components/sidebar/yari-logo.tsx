import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface YariLogoProps {
  size?: number;
}
export function YariLogo({ size = 24 }: YariLogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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