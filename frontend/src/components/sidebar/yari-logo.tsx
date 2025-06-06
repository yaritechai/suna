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
      src="/yari-symbol.svg"
      alt="Yari"
      width={size}
      height={size}
      className={`${mounted && theme === 'dark' ? 'invert' : ''} flex-shrink-0`}
    />
  );
} 