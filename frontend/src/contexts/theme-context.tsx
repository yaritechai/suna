'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { ColorTheme, applyThemeColors } from '@/lib/themes';

interface ThemeContextType {
  // Light/Dark mode from next-themes
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  
  // Color theme management
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  
  // Utility functions
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultColorTheme?: ColorTheme;
}

export function ThemeProvider({ children, defaultColorTheme = 'ocean' }: ThemeProviderProps) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(defaultColorTheme);
  const [mounted, setMounted] = useState(false);

  // Load saved color theme from localStorage
  useEffect(() => {
    const savedColorTheme = localStorage.getItem('yari-color-theme');
    if (savedColorTheme && savedColorTheme in ['ocean', 'sunset', 'forest', 'purple', 'rose', 'emerald', 'amber']) {
      setColorThemeState(savedColorTheme as ColorTheme);
    }
    setMounted(true);
  }, []);

  // Apply color theme changes
  useEffect(() => {
    if (mounted) {
      applyThemeColors(colorTheme);
      localStorage.setItem('yari-color-theme', colorTheme);
    }
  }, [colorTheme, mounted]);

  const setColorTheme = (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
  };

  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    colorTheme,
    setColorTheme,
    isDark,
    isLight,
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useYariTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useYariTheme must be used within a ThemeProvider');
  }
  return context;
} 