'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';
import { themeChange } from 'theme-change';

const THEME_GROUPS = {
  'Default': [
    { name: 'light', label: 'Light', description: 'Clean and bright', colors: { primary: '#570df8', secondary: '#f000b8', accent: '#37cdbe' } },
    { name: 'dark', label: 'Dark', description: 'Easy on the eyes', colors: { primary: '#661AE6', secondary: '#D926AA', accent: '#1FB2A5' } },
  ],
  'Colorful': [
    { name: 'cupcake', label: 'Cupcake', description: 'Sweet and pastel', colors: { primary: '#65c3c8', secondary: '#ef9fbc', accent: '#eeaf3a' } },
    { name: 'bumblebee', label: 'Bumblebee', description: 'Yellow and bright', colors: { primary: '#e0a82e', secondary: '#f9d72f', accent: '#181830' } },
    { name: 'emerald', label: 'Emerald', description: 'Nature inspired', colors: { primary: '#66cc8a', secondary: '#377cfb', accent: '#ea5234' } },
    { name: 'valentine', label: 'Valentine', description: 'Romantic pink', colors: { primary: '#e96d7b', secondary: '#a991f7', accent: '#88dbdd' } },
    { name: 'garden', label: 'Garden', description: 'Fresh greens', colors: { primary: '#5c7f67', secondary: '#ecf4e7', accent: '#f5d5ae' } },
    { name: 'aqua', label: 'Aqua', description: 'Ocean blues', colors: { primary: '#09ecf3', secondary: '#966fb3', accent: '#ffe999' } },
    { name: 'pastel', label: 'Pastel', description: 'Soft colors', colors: { primary: '#d1c1d7', secondary: '#f6cbd1', accent: '#b4e9d6' } },
    { name: 'fantasy', label: 'Fantasy', description: 'Magical vibes', colors: { primary: '#6e0b75', secondary: '#007ebd', accent: '#f18c47' } },
    { name: 'sunset', label: 'Sunset', description: 'Warm evening tones', colors: { primary: '#ff5e5b', secondary: '#ffc23c', accent: '#3f88c5' } },
    { name: 'autumn', label: 'Autumn', description: 'Fall colors', colors: { primary: '#8c0327', secondary: '#d85251', accent: '#efcc00' } },
    { name: 'acid', label: 'Acid', description: 'Neon and bold', colors: { primary: '#ff00ff', secondary: '#ffff00', accent: '#00ffff' } },
    { name: 'lemonade', label: 'Lemonade', description: 'Fresh and citrusy', colors: { primary: '#519903', secondary: '#e9e92f', accent: '#eff404' } },
  ],
  'Professional': [
    { name: 'corporate', label: 'Corporate', description: 'Business professional', colors: { primary: '#4b6bfb', secondary: '#7b92b2', accent: '#67cba0' } },
    { name: 'business', label: 'Business', description: 'Clean enterprise', colors: { primary: '#1eb854', secondary: '#1fd65f', accent: '#1db584' } },
    { name: 'winter', label: 'Winter', description: 'Cool and crisp', colors: { primary: '#047aed', secondary: '#463aa1', accent: '#c148ac' } },
    { name: 'nord', label: 'Nord', description: 'Arctic inspired', colors: { primary: '#5e81ac', secondary: '#81a1c1', accent: '#88c0d0' } },
    { name: 'wireframe', label: 'Wireframe', description: 'Minimal lines', colors: { primary: '#b8b8b8', secondary: '#b8b8b8', accent: '#b8b8b8' } },
  ],
  'Dark & Dramatic': [
    { name: 'synthwave', label: 'Synthwave', description: 'Retro futuristic', colors: { primary: '#e779c1', secondary: '#58c7f3', accent: '#f3cc30' } },
    { name: 'retro', label: 'Retro', description: 'Vintage vibes', colors: { primary: '#ef9995', secondary: '#a4cbb4', accent: '#dc8850' } },
    { name: 'cyberpunk', label: 'Cyberpunk', description: 'Neon future', colors: { primary: '#ff7598', secondary: '#75d1f0', accent: '#c07eec' } },
    { name: 'halloween', label: 'Halloween', description: 'Spooky orange', colors: { primary: '#f28c18', secondary: '#6d3a9c', accent: '#51a800' } },
    { name: 'forest', label: 'Forest', description: 'Deep woodland', colors: { primary: '#1eb854', secondary: '#1fd65f', accent: '#1db584' } },
    { name: 'black', label: 'Black', description: 'Pure darkness', colors: { primary: '#343232', secondary: '#343232', accent: '#343232' } },
    { name: 'luxury', label: 'Luxury', description: 'Premium gold', colors: { primary: '#ffffff', secondary: '#152747', accent: '#513448' } },
    { name: 'dracula', label: 'Dracula', description: 'Gothic purple', colors: { primary: '#ff79c6', secondary: '#bd93f9', accent: '#ffb86c' } },
    { name: 'night', label: 'Night', description: 'Midnight blue', colors: { primary: '#38bdf8', secondary: '#818cf8', accent: '#f471b5' } },
    { name: 'coffee', label: 'Coffee', description: 'Rich browns', colors: { primary: '#DB924B', secondary: '#263E3F', accent: '#10576D' } },
    { name: 'dim', label: 'Dim', description: 'Muted tones', colors: { primary: '#9ca3af', secondary: '#9ca3af', accent: '#9ca3af' } },
    { name: 'abyss', label: 'Abyss', description: 'Deep void', colors: { primary: '#3730a3', secondary: '#7c3aed', accent: '#a855f7' } },
  ],
  'Custom': [
    { name: 'midnight', label: 'Midnight', description: 'Deep blue darkness', colors: { primary: '#1a237e', secondary: '#3949ab', accent: '#00acc1' } },
    { name: 'neonpunk', label: 'Neon Punk', description: 'Electric magenta', colors: { primary: '#e91e63', secondary: '#ffc107', accent: '#9c27b0' } },
    { name: 'softlight', label: 'Soft Light', description: 'Gentle purple hues', colors: { primary: '#7c4dff', secondary: '#651fff', accent: '#00e676' } },
  ],
  'Special': [
    { name: 'cmyk', label: 'CMYK', description: 'Print colors', colors: { primary: '#45AEEE', secondary: '#E8488A', accent: '#FFF04C' } },
    { name: 'lofi', label: 'Lo-Fi', description: 'Chill vibes', colors: { primary: '#0D0D0D', secondary: '#0D0D0D', accent: '#0D0D0D' } },
    { name: 'caramellatte', label: 'Caramel Latte', description: 'Warm coffee tones', colors: { primary: '#8b5a3c', secondary: '#d4a574', accent: '#f4e4bc' } },
    { name: 'silk', label: 'Silk', description: 'Smooth and elegant', colors: { primary: '#d1c4e9', secondary: '#f8bbd9', accent: '#b39ddb' } },
  ],
};

interface ThemeSelectorProps {
  variant?: 'button' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ThemeSelector({ 
  variant = 'button', 
  size = 'default', 
  showLabel = true,
  className = ''
}: ThemeSelectorProps) {
  const [currentTheme, setCurrentTheme] = useState<string>('light');

  useEffect(() => {
    // Initialize theme-change
    themeChange(false);

    // Get current theme from localStorage or default
    const savedTheme = localStorage.getItem('theme') || 'bumblebee';
    setCurrentTheme(savedTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update dark class for proper dark mode handling
    const isDarkTheme = savedTheme === 'dark' || 
      ['synthwave', 'retro', 'cyberpunk', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'night', 'coffee', 'dim', 'abyss'].includes(savedTheme);
    
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem('theme', themeName);
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Update dark class for proper dark mode handling
    const isDarkTheme = themeName === 'dark' || 
      ['synthwave', 'retro', 'cyberpunk', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'night', 'coffee', 'dim', 'abyss'].includes(themeName);
    
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Dispatch custom event for other components to react to theme change
    window.dispatchEvent(new CustomEvent('themeChange', { detail: themeName }));
  };

  const getCurrentThemeInfo = () => {
    for (const group of Object.values(THEME_GROUPS)) {
      const theme = group.find(t => t.name === currentTheme);
      if (theme) return theme;
    }
    // Return a proper fallback for unknown themes
    return { 
      name: currentTheme, 
      label: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1) || 'Light', 
      description: 'Current theme', 
      colors: { primary: '#570df8', secondary: '#f000b8', accent: '#37cdbe' } 
    };
  };

  const currentThemeInfo = getCurrentThemeInfo();

  const ThemePreview = ({ theme }: { theme: any }) => (
    <div className="flex gap-1 mr-3">
      <div 
        className="w-3 h-3 rounded-full border border-base-content/20" 
        style={{ backgroundColor: theme.colors.primary }}
        title="Primary color"
      />
      <div 
        className="w-3 h-3 rounded-full border border-base-content/20" 
        style={{ backgroundColor: theme.colors.secondary }}
        title="Secondary color"
      />
      <div 
        className="w-3 h-3 rounded-full border border-base-content/20" 
        style={{ backgroundColor: theme.colors.accent }}
        title="Accent color"
      />
    </div>
  );

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            className={`text-base-content hover:bg-base-200 focus:bg-base-200 ${className}`}
            aria-label="Select theme"
          >
            <Palette className="h-4 w-4" />
            {showLabel && size !== 'sm' && (
              <span className="ml-2">{currentThemeInfo.label}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-base-100 border border-base-300 text-base-content shadow-2xl z-[9999] backdrop-blur-none" align="end">
          {Object.entries(THEME_GROUPS).map(([groupName, themes]) => (
            <div key={groupName}>
              <DropdownMenuLabel className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                {groupName}
              </DropdownMenuLabel>
              {themes.map((theme) => (
                <DropdownMenuItem
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  className="flex items-center justify-between cursor-pointer py-3 hover:bg-base-200 focus:bg-base-200"
                >
                  <div className="flex items-center flex-1">
                    <ThemePreview theme={theme} />
                    <div className="flex-1">
                      <div className="font-medium text-base-content">{theme.label}</div>
                      <div className="text-xs text-base-content/60">{theme.description}</div>
                    </div>
                  </div>
                  {currentTheme === theme.name && (
                    <Check className="h-4 w-4 text-primary ml-2" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`gap-2 text-base-content border-base-300 hover:bg-base-200 focus:bg-base-200 ${className}`}
        >
          <Palette className="h-4 w-4" />
          {showLabel && (
            <span>
              {size === 'sm' ? currentThemeInfo.label : `Theme: ${currentThemeInfo.label}`}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-base-100 border border-base-300 text-base-content shadow-2xl z-[9999] backdrop-blur-none" align="end">
        <DropdownMenuLabel className="text-base-content">Choose a theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(THEME_GROUPS).map(([groupName, themes]) => (
          <div key={groupName}>
            <DropdownMenuLabel className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
              {groupName}
            </DropdownMenuLabel>
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className="flex items-center justify-between cursor-pointer py-3 hover:bg-base-200 focus:bg-base-200"
              >
                <div className="flex items-center flex-1">
                  <ThemePreview theme={theme} />
                  <div className="flex-1">
                    <div className="font-medium text-base-content">{theme.label}</div>
                    <div className="text-xs text-base-content/60">{theme.description}</div>
                  </div>
                </div>
                {currentTheme === theme.name && (
                  <Check className="h-4 w-4 text-primary ml-2" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook for components to react to theme changes
export function useTheme() {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const handleThemeChange = (event: CustomEvent) => {
      setTheme(event.detail);
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  return { theme, setTheme };
} 