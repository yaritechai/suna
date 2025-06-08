'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200/60 dark:bg-white/10 border border-gray-300/50 dark:border-white/20 backdrop-blur-sm animate-pulse transition-colors duration-300" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative h-8 w-8 rounded-full bg-gray-200/60 dark:bg-white/10 border border-gray-300/50 dark:border-white/20 backdrop-blur-sm hover:bg-gray-300/70 dark:hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
    >
      <Sun className="h-4 w-4 text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
