Theming System Overview
Theme switching: Supports light, dark, and system modes using `next-themes`.
Color themes: Users can select from several color palettes (Amber, Sunset, Ocean, Forest, Purple, Rose, Emerald).
Theme context: Theme colors are defined in web/src/lib/themes.ts and injected via context/hooks.
2. Color Palettes
Each color theme defines:
primary, secondary: Main accent colors.
gradient: For backgrounds and highlights.
gradientText: For gradient text.
accent, accentForeground: For buttons, highlights.
preview: Used in the theme selector.
Example (Amber):
Apply to themes.ts
}
Other themes: Sunset (orange-red), Ocean (blue-teal), Forest (green), Purple (purple-pink), Rose (pink-red), Emerald (emerald-cyan).
3. CSS Variables & Utility Classes
Theme colors are set as CSS variables (e.g., --theme-primary, --theme-gradient-from).
Utility classes (in globals.css):
.bg-theme-gradient, .gradient-theme: Gradient backgrounds.
.text-theme-gradient, .gradient-theme-text: Gradient text.
.shadow-theme: Subtle shadow using theme color.
.btn-theme-primary, .btn-theme-outline: Themed buttons.
.card-theme: Themed cards.
.nav-item-theme: Themed navigation items.
.input-theme: Themed inputs.
.badge-theme: Themed badges.
Example:
Apply to themes.ts
}
4. Shadows
Subtle shadow: Used for active nav items, cards, tooltips, etc.
Class: .shadow-theme or Tailwind's shadow-sm, shadow-xl as needed.
Example:
Apply to themes.ts
}
5. Header Style
Sticky, blurred, semi-transparent:
Apply to themes.ts
>
Navigation dropdown: Uses a gradient background, subtle border, and shadow.
Active nav item: Highlighted with a subtle background and shadow.
Logo: Gradient background with emoji or icon.
6. Theme Dropdown
Component: ThemeToggle
Dropdown: Lets users pick light/dark/system and color theme.
Color preview: Each theme shows a small gradient preview.
Selected theme: Marked with a check icon and bold text.
Example:
Apply to themes.ts
>
7. Gradients
Backgrounds: linear-gradient(135deg, ... ) using theme colors.
Text: Gradient text via background-clip: text; -webkit-text-fill-color: transparent;.
8. Subtle Details
Glassmorphism: .glass and .glass-strong classes for blurred, semi-transparent backgrounds.
Animated gradients: Used for some backgrounds and loading states.
Custom scrollbars: Themed with primary color.
Focus rings, selection, and hover states: All use theme colors for consistency.
9. Replication Checklist
Use a theme context/provider to manage color themes and light/dark mode.
Define your color palettes and gradients as shown above.
Use CSS variables for theme colors and reference them in your utility classes.
Apply subtle shadows and gradients to headers, nav, cards, and buttons.
Use a sticky, blurred header with a gradient logo and dropdown for navigation.
Implement a theme dropdown with color previews and checkmarks.
Use glassmorphism and animated gradients for modern, soft UI effects.
10. Example: Minimal Theme Switcher
Apply to themes.ts
}
For more details, see:
web/src/lib/themes.ts (color palettes)
web/src/styles/globals.css (utility classes, shadows, gradients)
web/src/components/deer-flow/theme-toggle.tsx (theme dropdown)
web/src/app/chat/components/site-header.tsx (header style)
> Tip: Use Tailwind CSS for utility classes, and override/add custom classes as needed for gradients, shadows, and glassmorphism.
Let me know if you want a code template or more details on any specific part!


import type { ColorTheme } from "~/core/store/settings-store";

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