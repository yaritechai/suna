'use client';

import React, { useEffect, useState } from 'react';

export function ThemeDebug() {
  const [currentTheme, setCurrentTheme] = useState<string>('');
  const [cssVars, setCssVars] = useState<{ [key: string]: string }>({});

  const refreshData = () => {
    // Get current theme
    const theme = document.documentElement.getAttribute('data-theme') || 'none';
    setCurrentTheme(theme);

    // Get computed CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const vars: { [key: string]: string } = {};
    
    // Check some key Daisy UI CSS variables
    const daisyVars = ['--b1', '--b2', '--b3', '--bc', '--p', '--s', '--a'];
    daisyVars.forEach(varName => {
      vars[varName] = computedStyle.getPropertyValue(varName);
    });
    
    setCssVars(vars);
  };

  useEffect(() => {
    refreshData();
    // Refresh every 2 seconds to catch changes
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, []);

  const switchTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setTimeout(refreshData, 100);
  };

  const testThemes = [
    'light', 'dark', 'synthwave', 'retro', 'cyberpunk', 'dracula', 'nord', 'sunset',
    'midnight', 'neonpunk', 'softlight' // Custom themes
  ];

  return (
    <div className="fixed top-4 left-4 z-50 bg-base-200 p-4 rounded-lg shadow-lg border border-base-300 text-xs max-w-sm">
      <h3 className="font-bold text-base-content mb-2">Theme Debug</h3>
      
      {/* Theme switcher */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Quick Theme Tests:</h3>
        <div className="flex flex-wrap gap-2">
          {testThemes.map((theme) => (
            <button
              key={theme}
              onClick={() => switchTheme(theme)}
              className="btn btn-sm btn-outline"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-1 text-base-content/70">
        <div>Current theme: <span className="font-mono">{currentTheme}</span></div>
        <div>CSS Variables:</div>
        {Object.entries(cssVars).map(([key, value]) => (
          <div key={key} className="pl-2">
            <span className="font-mono">{key}:</span> 
            <span className="text-primary ml-1">{value || 'undefined'}</span>
          </div>
        ))}
      </div>
      
      {/* Color swatches */}
      <div className="mt-3">
        <div className="text-base-content/70 mb-1">Color Test:</div>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-base-100 border border-base-300" title="base-100"></div>
          <div className="w-4 h-4 bg-base-200 border border-base-300" title="base-200"></div>
          <div className="w-4 h-4 bg-base-300 border border-base-300" title="base-300"></div>
          <div className="w-4 h-4 bg-primary" title="primary"></div>
          <div className="w-4 h-4 bg-secondary" title="secondary"></div>
          <div className="w-4 h-4 bg-accent" title="accent"></div>
        </div>
      </div>
    </div>
  );
} 