'use client';

import * as React from 'react';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export function FloatingThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const currentModeIcon = () => {
    switch (resolvedTheme) {
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  const displayModes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-base-100/95 backdrop-blur border-base-300 shadow-lg hover:bg-base-200"
          >
            {currentModeIcon()}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-base-100 border-base-300">
          <DropdownMenuLabel className="flex items-center gap-2 text-base-content">
            <Monitor className="h-4 w-4" />
            Display Mode
          </DropdownMenuLabel>
          {displayModes.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem 
              key={value} 
              onClick={() => setTheme(value)}
              className="flex items-center justify-between hover:bg-base-200 focus:bg-base-200"
            >
              <div className="flex items-center gap-2 text-base-content">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
                            {resolvedTheme === value && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 