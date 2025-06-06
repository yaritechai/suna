# Rebrand Changelog: Suna → Yari

This file documents all changes made during the rebranding of the project from "Suna" to "Yari". Each entry includes the file, line(s), and a brief description of the change.

---

## [Date: YYYY-MM-DD] Initial Rebrand

- All instances of "Suna" (case-insensitive) changed to "Yari" across the codebase, including documentation, user-facing text, and configuration files.
- All URLs referencing "suna.so" updated to the new domain (TBD: e.g., "yari.so").
- Docker image names changed from `kortix/suna:...` to `yari/agent:...` (or as per new convention).
- All GitHub repo URLs updated from `github.com/kortix-ai/suna` to the new repository (TBD).
- All environment variables, storage keys, and internal identifiers updated from `suna-...` to `yari-...`.
- All badges, screenshots, and alt text referencing "Suna" updated to "Yari".
- All sample data, test scripts, and mock data updated to use "Yari" branding.

---

## File-by-file change log

<!--
Add entries here as you make changes, e.g.:
- README.md: Updated project name, badges, and all references from Suna to Yari.
- backend/pyproject.toml: Changed project name and homepage URL.
- frontend/package.json: Changed project name and description.
- backend/sandbox/docker/docker-compose.yml: Updated image name from kortix/suna to yari/agent.
- ...
-->

- frontend/src/components/sidebar/kortix-logo.tsx: Updated logo image and alt text from 'Kortix' to 'Yari'.
- frontend/src/components/sidebar/yari-logo.tsx: Created new YariLogo component for Yari branding.
- frontend/src/components/sidebar/kortix-enterprise-modal.tsx: Updated logo image and alt text from 'Kortix' to 'Yari'.
- frontend/src/components/sidebar/yari-enterprise-modal.tsx: Created new YariProcessModal component for Yari branding.
- frontend/src/components/sidebar/cta.tsx: Updated import and usage of enterprise modal to use Yari branding.
- frontend/src/components/sidebar/sidebar-left.tsx: Updated import and usage of logo to use Yari branding.
- frontend/src/components/thread/content/ThreadContent.tsx: Updated import and usage of logo to use Yari branding.
- frontend/src/components/home/sections/footer-section.tsx: Updated logo image and alt text from 'Kortix' to 'Yari'.

## Modern UI Styling Updates

- frontend/src/components/thread/content/ThreadContent.tsx: Modernized chat message styling with white/black backgrounds, subtle shadows, gradient accents, and smooth transitions.
- frontend/src/components/thread/chat-input/chat-input.tsx: Updated chat input area with glassmorphic styling, subtle shadows, and gradient focus effects.
- frontend/src/components/sidebar/sidebar-left.tsx: Modernized sidebar with glassmorphic background, gradient logo accent, and modern navigation items with hover effects.
- frontend/src/components/sidebar/cta.tsx: Updated CTA card with clean white/black styling, subtle shadows, and gradient hover accents.
- frontend/src/components/thread/tool-call-side-panel.tsx: Updated tool panel header with modern styling and gradient accents.
- frontend/src/components/thread/chat-input/message-input.tsx: Modernized message input with clean styling and gradient submit button.
- frontend/src/components/thread/content/loader.tsx: Updated loader with modern glassmorphic styling and gradient dot animations.

## Comprehensive Theme System Implementation

### Theme System Files Created/Updated:
- frontend/src/lib/themes.ts: Created comprehensive theme system with 7 color themes (Ocean, Sunset, Forest, Purple, Rose, Emerald, Amber).
- frontend/src/contexts/theme-context.tsx: Created theme context provider managing both light/dark mode and color themes.
- frontend/src/components/ui/theme-selector.tsx: Created beautiful modern theme dropdown with color previews and mode selection.
- frontend/src/app/globals.css: Added extensive theme utility classes and CSS variables for modern styling.
- frontend/src/app/providers.tsx: Updated to use enhanced theme provider system.

### Theme Features:
- **Dynamic Color Themes**: 7 beautiful color palettes with gradient support
- **Light/Dark Mode**: Seamless switching between appearance modes
- **Theme Persistence**: Saves user preferences in localStorage
- **CSS Variables**: Dynamic theme colors applied via CSS custom properties
- **Utility Classes**: Comprehensive set of theme-aware utility classes
- **Glassmorphism Effects**: Modern glass and backdrop blur effects
- **Gradient Accents**: Dynamic gradient backgrounds and text effects
- **Theme-aware Shadows**: Shadows that adapt to the selected color theme

### UI Components Updated with Theme System:
- **Sidebar**: Logo, navigation items, and theme selector integration
- **Chat Input**: Dynamic focus states and gradient submit buttons
- **Tool Panel**: Header styling with theme-aware gradients
- **Theme Selector**: Beautiful dropdown with color previews and smooth transitions

### Modern Styling Improvements:
- **Clean Minimal Design**: White/black primary colors with gradient accents
- **Subtle Drop Shadows**: Beautiful depth and layering effects
- **Smooth Transitions**: 300ms duration animations throughout
- **Responsive Design**: Mobile-friendly theme selector and components
- **Accessibility**: Proper contrast ratios and keyboard navigation 