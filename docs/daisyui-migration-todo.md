# 🎨 DaisyUI Color Migration To-Do List

**Progress**: 16/87 items completed

## 🔧 **Recent Fixes**
- **CodeMirror Issue**: Fixed module resolution error by removing direct `@codemirror/view` import
- **Build Errors**: Resolved all TypeScript and dependency issues
- **Sidebar Theming**: Enhanced with proper DaisyUI base color hierarchy
- **Sidebar Base Component**: Fixed hardcoded `bg-sidebar` colors with DaisyUI `!bg-base-200` overrides
- **Dashboard Layout**: Fixed `bg-base-200` → `bg-base-100` for proper page background contrast
- **Marketplace Page**: Updated hardcoded colors to use DaisyUI semantic colors
- **Input Gradients**: Updated chat input area with theme-aware gradients

## 🎨 **DaisyUI Theme Implementation Summary**

### ✅ **Sidebar Enhancements**
1. **Background**: Updated to `bg-base-200/95` with backdrop blur for subtle transparency
2. **Border**: Enhanced with `border-base-300/50` for proper contrast
3. **Shadow**: Increased to `shadow-base-content/10` for better depth
4. **Header**: Added subtle border separator `border-base-300/30`
5. **Logo**: Added gradient text effect using `from-primary to-secondary`
6. **CTA Section**: Added subtle background `bg-base-200/30` with border
7. **Footer**: Enhanced with backdrop blur and border separator
8. **Navigation Items**: Using `bg-base-300` for hover/active states (proper elevation)

### ✅ **Input Area Enhancements**
1. **Container**: Added gradient `bg-gradient-to-t from-base-200 via-base-200 to-base-200/80`
2. **Card**: Enhanced shadow and focus states with `focus-within:ring-1 focus-within:ring-primary/20`
3. **Textarea**: Added subtle gradient `bg-gradient-to-b from-transparent to-base-200/20`
4. **Focus States**: Proper theme integration with `focus-within:border-primary`

### ✅ **Base Color Hierarchy Applied**
- **`base-100`**: Main page backgrounds (lightest)
- **`base-200`**: Sidebar, elevated cards, input containers (elevated)
- **`base-300`**: Borders, highest elevation elements, hover states (highest contrast)

This document tracks the migration from manual dark mode styling to DaisyUI semantic colors across the entire codebase.

---

## 🎯 **HIGH PRIORITY** (Core User Interface)

### **Tool Views** (`frontend/src/components/thread/tool-views/`)

#### **DataProviderEndpointsToolView.tsx** ✅
- [x] Replace `text-white` with `text-primary-content` (line 157)
- [x] ~~Replace `text-white` with `text-primary-content` (line 167)~~ (only one instance found)
- [x] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 218)
- [x] Replace `border-zinc-200 dark:border-zinc-800` with `border-base-300` (line 218)

#### **ExecuteDataProviderCallToolView.tsx** ✅
- [x] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 109)
- [x] Replace `text-white` with `text-primary-content` (line 167)
- [x] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 213)
- [x] Replace `border-zinc-200 dark:border-zinc-800` with `border-base-300` (line 213)

#### **WebScrapeToolView.tsx**
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 130)
- [ ] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 244)
- [ ] Replace `border-zinc-200 dark:border-zinc-800` with `border-base-300` (line 244)

#### **GenericToolView.tsx** ✅
- [x] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 131)

#### **TerminateCommandToolView.tsx**
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 152)
- [ ] Replace `bg-black` with `bg-base-300` (line 271)
- [ ] Replace `border-zinc-700/20` with `border-base-300` (line 271)

#### **FileOperationToolView.tsx**
- [ ] Replace `data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900` with `data-[state=active]:bg-base-100` (line 294)
- [ ] Replace `data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900` with `data-[state=active]:bg-base-100` (line 298)

#### **WebSearchToolView.tsx** ✅
- [x] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 196)
- [x] Replace `border-zinc-200 dark:border-zinc-800` with `border-base-300` (line 196)
- [x] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 294)

#### **CommandToolView.tsx**
- [ ] Replace `bg-black` with `bg-base-300` (line 182)
- [ ] Replace `border-zinc-700/20` with `border-base-300` (line 182)

#### **ExposePortToolView.tsx** ✅
- [x] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 54)
- [x] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 102)
- [x] Replace `border-zinc-200 dark:border-zinc-800` with `border-base-300` (line 102)

#### **McpToolView.tsx**
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 80)
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 89)
- [ ] Replace `border-zinc-200 dark:border-zinc-800` with `border-base-300` (line 89)

#### **mcp-content-renderer.tsx**
- [ ] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 85)
- [ ] Replace `border-zinc-200 dark:border-zinc-700` with `border-base-300` (line 85)

#### **StrReplaceToolView.tsx**
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 35)
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 69)
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 221)
- [ ] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 276)
- [ ] Replace `border-zinc-200 dark:border-zinc-800` with `border-base-300` (line 276)

#### **BrowserToolView.tsx**
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 257)
- [ ] Replace `bg-white dark:bg-black` with `bg-base-100` (line 299)
- [ ] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 333)
- [ ] Replace `border-zinc-200 dark:border-zinc-700` with `border-base-300` (line 333)

#### **SeeImageToolView.tsx**
- [ ] Replace `bg-white dark:bg-black/30` with `bg-base-100` (line 117)
- [ ] Replace `bg-white dark:bg-zinc-900` with `bg-base-100` (line 148)
- [ ] Replace `border-zinc-200 dark:border-zinc-700` with `border-base-300` (line 148)
- [ ] Replace `bg-white dark:bg-zinc-800` with `bg-base-200` (line 181)
- [ ] Replace `bg-white dark:bg-zinc-800` with `bg-base-200` (line 193)
- [ ] Replace `bg-white dark:bg-zinc-800` with `bg-base-200` (line 205)
- [ ] Replace `bg-white dark:bg-zinc-950` with `bg-base-100` (line 291)

### **Thread Components**
#### **thread-site-header.tsx**
- [ ] Replace `bg-amber-500 text-black` with `bg-warning text-warning-content` (line 183)

### **Core Dashboard Layout**
#### **ThreadLayout.tsx**
- [ ] Replace `bg-amber-500 text-black` with `bg-warning text-warning-content` (line 79)

---

## 🟡 **MEDIUM PRIORITY** (Forms & Settings)

### **Team Management** (`frontend/src/components/basejump/`)

#### **edit-team-name.tsx**
- [ ] Replace `border-subtle dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 28)
- [ ] Replace `bg-primary hover:bg-primary/90 text-white` with `btn btn-primary` (line 35)

#### **new-team-form.tsx**
- [ ] Replace `border-input/60 dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 51)
- [ ] Replace `border-input/60 dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 73)

#### **edit-personal-account-name.tsx**
- [ ] Replace `border-subtle dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 28)
- [ ] Replace `bg-primary hover:bg-primary/90 text-white` with `btn btn-primary` (line 35)

#### **edit-team-slug.tsx**
- [ ] Replace `border-subtle dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 34)
- [ ] Replace `bg-primary hover:bg-primary/90 text-white` with `btn btn-primary` (line 42)

#### **manage-teams.tsx**
- [ ] Replace `border-subtle dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 23)

### **Settings Pages**

#### **[accountSlug]/settings/members/page.tsx**
- [ ] Replace `border-subtle dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 90)
- [ ] Replace `border-subtle dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 102)

#### **[accountSlug]/settings/page.tsx**
- [ ] Replace `border-subtle dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 68)
- [ ] Replace `border-subtle dark:border-white/10 bg-white dark:bg-background-secondary` with `border-base-300 bg-base-100` (line 78)

### **Billing Components**
#### **account-billing-status.tsx**
- [ ] Replace `bg-primary text-white hover:bg-primary/90` with `btn btn-primary` (line 186)

---

## 🟢 **LOW PRIORITY** (Marketing & Static Pages)

### **Home Page Components** (`frontend/src/components/home/`)

#### **third-bento-animation.tsx**
- [ ] Replace custom dark styling with semantic colors (line 245)

#### **fourth-bento-animation.tsx**
- [ ] Replace `bg-black dark:bg-accent` with `bg-base-300` (line 202)

#### **first-bento-animation.tsx**
- [ ] Replace `bg-secondary text-white` with `bg-secondary text-secondary-content` (line 63)

#### **sections/cta-section.tsx**
- [ ] Replace `text-white` with `text-base-content` (line 22)
- [ ] Replace `bg-white text-black` with `bg-base-100 text-base-content` (line 28)
- [ ] Replace `text-white` with `text-base-content` (line 32)

#### **sections/open-source-section.tsx**
- [ ] Replace complex color styling with DaisyUI button classes (line 53)

#### **sections/use-cases-section.tsx**
- [ ] Replace `text-white` with `text-base-content` (line 89)

#### **sections/pricing-section.tsx**
- [ ] Replace `bg-white dark:bg-[#3F3F46]` with `bg-base-100` (line 102)
- [ ] Replace `text-white` with semantic colors (line 514)
- [ ] Replace `bg-white dark:bg-background` with `bg-base-100` (line 538)

#### **ui/hero-video-dialog.tsx**
- [ ] Replace `text-white` with `text-primary-content` (line 111)
- [ ] Replace complex color styling with semantic colors (line 136)

#### **ui/button.tsx**
- [ ] Replace `text-white` with `text-destructive-content` (line 14)

#### **ui/feature-slideshow.tsx**
- [ ] Replace `data-[state=open]:bg-white dark:data-[state=open]:bg-[#27272A]` with `data-[state=open]:bg-base-100` (line 286)

### **Sidebar Enterprise Modals**

#### **yari-enterprise-modal.tsx**
- [ ] Replace `bg-white dark:bg-black` with `bg-base-100` (line 39)
- [ ] Replace `border-gray-200 dark:border-gray-800` with `border-base-300` (line 39)
- [ ] Replace `bg-white dark:bg-[#171717]` with `bg-base-100` (line 139)

#### **kortix-enterprise-modal.tsx**
- [ ] Replace `bg-white dark:bg-black` with `bg-base-100` (line 39)
- [ ] Replace `border-gray-200 dark:border-gray-800` with `border-base-300` (line 39)
- [ ] Replace `bg-white dark:bg-[#171717]` with `bg-base-100` (line 139)

### **Agent Components**

#### **agents-grid.tsx**
- [ ] Replace `text-white fill-white` with `text-primary-content fill-primary-content` (line 65)
- [ ] Replace `text-white fill-white` with `text-primary-content fill-primary-content` (line 239)
- [ ] Replace `text-white` with `text-primary-content` (line 244)

#### **marketplace/page.tsx**
- [ ] Replace `text-white` with `text-primary-content` (line 218)

### **Maintenance & Error Pages**

#### **maintenance-alert.tsx**
- [ ] Replace `text-white` with `text-primary-content` (line 102)

#### **not-found.tsx**
- [ ] Replace `bg-primary text-white hover:bg-primary/90` with `btn btn-primary` (line 108)

---

## 📋 **Migration Pattern Reference**

### **Common Replacements:**
```tsx
// Backgrounds
bg-white dark:bg-zinc-900     → bg-base-100
bg-white dark:bg-zinc-950     → bg-base-100  
bg-gray-100 dark:bg-gray-800  → bg-base-200
bg-gray-200 dark:bg-gray-700  → bg-base-300

// Text Colors
text-black dark:text-white    → text-base-content
text-gray-600 dark:text-gray-300 → text-base-content/70
text-white                    → text-primary-content (on colored backgrounds)

// Borders
border-gray-200 dark:border-gray-800 → border-base-300
border-zinc-200 dark:border-zinc-700 → border-base-300

// Buttons
bg-primary text-white hover:bg-primary/90 → btn btn-primary
```

### **How to Use This File:**
1. Pick a priority level (HIGH → MEDIUM → LOW)
2. Choose a file to work on
3. Check off items as you complete them
4. Update the progress counter at the top
5. Test theme switching after each file completion

### **Testing Checklist:**
After completing each file, verify:
- [ ] Light theme works correctly
- [ ] Dark theme works correctly  
- [ ] Custom themes (midnight, neonpunk, softlight) work correctly
- [ ] No visual regressions
- [ ] Colors have proper contrast ratios

---

**Last Updated:** [Date when you last worked on this]  
**Current Focus:** [Which file/section you're currently working on] 