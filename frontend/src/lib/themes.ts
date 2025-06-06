export type ColorTheme = 'ocean' | 'sunset' | 'forest' | 'purple' | 'rose' | 'emerald' | 'amber';

export interface ThemeColors {
  name: string;
  displayName: string;
  description: string;
  primary: string;
  secondary: string;
  gradient: {
    from: string;
    to: string;
    via?: string;
  };
  gradientText: {
    from: string;
    to: string;
    via?: string;
  };
  accent: string;
  accentForeground: string;
  preview: string; // For theme selector preview
}

export const THEME_COLORS: Record<ColorTheme, ThemeColors> = {
  ocean: {
    name: "ocean",
    displayName: "Ocean",
    description: "Cool blue to teal gradient",
    primary: "#0ea5e9",
    secondary: "#06b6d4",
    gradient: {
      from: "#38bdf8",
      to: "#0891b2",
      via: "#0ea5e9",
    },
    gradientText: {
      from: "#38bdf8",
      to: "#0891b2",
      via: "#0ea5e9",
    },
    accent: "#0ea5e9",
    accentForeground: "#ffffff",
    preview: "linear-gradient(135deg, #38bdf8, #0ea5e9, #0891b2)",
  },
  sunset: {
    name: "sunset",
    displayName: "Sunset",
    description: "Vibrant orange to red gradient",
    primary: "#f97316",
    secondary: "#ea580c",
    gradient: {
      from: "#fb923c",
      to: "#dc2626",
      via: "#f97316",
    },
    gradientText: {
      from: "#fb923c",
      to: "#dc2626",
      via: "#f97316",
    },
    accent: "#f97316",
    accentForeground: "#ffffff",
    preview: "linear-gradient(135deg, #fb923c, #f97316, #dc2626)",
  },
  forest: {
    name: "forest",
    displayName: "Forest",
    description: "Natural green tones",
    primary: "#16a34a",
    secondary: "#15803d",
    gradient: {
      from: "#4ade80",
      to: "#15803d",
      via: "#16a34a",
    },
    gradientText: {
      from: "#4ade80",
      to: "#15803d",
      via: "#16a34a",
    },
    accent: "#16a34a",
    accentForeground: "#ffffff",
    preview: "linear-gradient(135deg, #4ade80, #16a34a, #15803d)",
  },
  purple: {
    name: "purple",
    displayName: "Purple",
    description: "Rich purple to pink gradient",
    primary: "#9333ea",
    secondary: "#a855f7",
    gradient: {
      from: "#a855f7",
      to: "#ec4899",
      via: "#9333ea",
    },
    gradientText: {
      from: "#a855f7",
      to: "#ec4899",
      via: "#9333ea",
    },
    accent: "#9333ea",
    accentForeground: "#ffffff",
    preview: "linear-gradient(135deg, #a855f7, #9333ea, #ec4899)",
  },
  rose: {
    name: "rose",
    displayName: "Rose",
    description: "Elegant pink to red gradient",
    primary: "#e11d48",
    secondary: "#f43f5e",
    gradient: {
      from: "#fb7185",
      to: "#be123c",
      via: "#e11d48",
    },
    gradientText: {
      from: "#fb7185",
      to: "#be123c",
      via: "#e11d48",
    },
    accent: "#e11d48",
    accentForeground: "#ffffff",
    preview: "linear-gradient(135deg, #fb7185, #e11d48, #be123c)",
  },
  emerald: {
    name: "emerald",
    displayName: "Emerald",
    description: "Fresh emerald to cyan gradient",
    primary: "#10b981",
    secondary: "#059669",
    gradient: {
      from: "#34d399",
      to: "#0891b2",
      via: "#10b981",
    },
    gradientText: {
      from: "#34d399",
      to: "#0891b2",
      via: "#10b981",
    },
    accent: "#10b981",
    accentForeground: "#ffffff",
    preview: "linear-gradient(135deg, #34d399, #10b981, #0891b2)",
  },
  amber: {
    name: "amber",
    displayName: "Amber",
    description: "Warm golden yellow tones",
    primary: "#f59e0b",
    secondary: "#fbbf24",
    gradient: {
      from: "#fbbf24",
      to: "#f59e0b",
    },
    gradientText: {
      from: "#fbbf24",
      to: "#f59e0b",
    },
    accent: "#f59e0b",
    accentForeground: "#000000",
    preview: "linear-gradient(135deg, #fbbf24, #f59e0b)",
  },
};

export function getThemeColors(theme: ColorTheme): ThemeColors {
  return THEME_COLORS[theme];
}

export function getThemeGradientCSS(theme: ColorTheme): string {
  const colors = getThemeColors(theme);
  if (colors.gradient.via) {
    return `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.via}, ${colors.gradient.to})`;
  }
  return `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`;
}

export function getThemeTextGradientCSS(theme: ColorTheme): string {
  const colors = getThemeColors(theme);
  if (colors.gradientText.via) {
    return `linear-gradient(135deg, ${colors.gradientText.from}, ${colors.gradientText.via}, ${colors.gradientText.to})`;
  }
  return `linear-gradient(135deg, ${colors.gradientText.from}, ${colors.gradientText.to})`;
}

export function applyThemeColors(theme: ColorTheme) {
  const colors = getThemeColors(theme);
  const root = document.documentElement;
  
  // Apply theme CSS variables
  root.style.setProperty('--theme-primary', colors.primary);
  root.style.setProperty('--theme-secondary', colors.secondary);
  root.style.setProperty('--theme-accent', colors.accent);
  root.style.setProperty('--theme-accent-foreground', colors.accentForeground);
  root.style.setProperty('--theme-gradient-from', colors.gradient.from);
  root.style.setProperty('--theme-gradient-to', colors.gradient.to);
  if (colors.gradient.via) {
    root.style.setProperty('--theme-gradient-via', colors.gradient.via);
  }
  root.style.setProperty('--theme-gradient-text-from', colors.gradientText.from);
  root.style.setProperty('--theme-gradient-text-to', colors.gradientText.to);
  if (colors.gradientText.via) {
    root.style.setProperty('--theme-gradient-text-via', colors.gradientText.via);
  }
} 