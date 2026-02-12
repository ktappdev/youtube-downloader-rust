# YouTube Downloader UI Modernization Plan

## Overview
Transform the current basic UI into a modern, YouTube-inspired interface with a dark theme primary and red accent colors.

## Design System

### Color Palette (YouTube-Inspired)

```css
/* Dark Theme - Primary */
--background: 0 0% 7%;           /* Near black #121212 */
--foreground: 0 0% 98%;          /* Off-white for text */

/* Card/Surface Colors */
--card: 0 0% 11%;                /* Slightly lighter than bg #1c1c1c */
--card-foreground: 0 0% 98%;

/* Primary Accent - YouTube Red */
--primary: 0 100% 50%;           /* YouTube Red #FF0000 */
--primary-foreground: 0 0% 100%; /* White text on red */

/* Secondary - Subtle gray */
--secondary: 0 0% 15%;           /* #262626 */
--secondary-foreground: 0 0% 98%;

/* Muted - For subtle backgrounds */
--muted: 0 0% 15%;
--muted-foreground: 0 0% 60%;    /* Gray text */

/* Accent - Lighter red for hover states */
--accent: 0 100% 60%;            /* Lighter red */
--accent-foreground: 0 0% 100%;

/* Borders and Inputs */
--border: 0 0% 20%;              /* Subtle border */
--input: 0 0% 15%;               /* Input background */
--ring: 0 100% 50%;              /* Focus ring - YouTube red */
```

### Typography
- Font: Inter or system-ui for clean, modern look
- Headings: Bold, larger sizes
- Body: Regular weight, comfortable line-height

### Spacing & Radius
- Increased border-radius for modern feel (8px default)
- Consistent spacing using Tailwind's spacing scale

---

## Component Updates

### 1. Card Component
**Current:** Basic border and shadow
**New:**
- Dark background with subtle gradient
- Hover lift effect with enhanced shadow
- Optional glow effect on focus
- Rounded corners (12px)

```tsx
// Enhanced card styling
className="rounded-xl bg-gradient-to-b from-[#1c1c1c] to-[#181818] 
           border border-white/5 shadow-lg shadow-black/20 
           hover:shadow-xl hover:shadow-black/30 hover:border-white/10 
           transition-all duration-300"
```

### 2. Button Component
**Current:** Basic solid/outline variants
**New:**
- Primary: YouTube red with gradient, hover brightening
- Secondary: Dark with subtle border
- Ghost: Transparent with hover background
- Add ripple effect on click
- Smooth transitions

```tsx
// Primary button
className="bg-gradient-to-r from-red-600 to-red-500 
           hover:from-red-500 hover:to-red-400 
           text-white font-semibold 
           shadow-lg shadow-red-500/25 
           hover:shadow-red-500/40 
           transition-all duration-200"

// Secondary/Outline button
className="bg-transparent border border-white/20 
           hover:bg-white/5 hover:border-white/30 
           text-white transition-all duration-200"
```

### 3. Input & Textarea Components
**Current:** Basic bordered inputs
**New:**
- Dark background with subtle border
- Focus state with red ring
- Placeholder text in muted color
- Smooth focus transitions

```tsx
className="bg-[#1c1c1c] border border-white/10 
           focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
           placeholder:text-gray-500 
           transition-all duration-200"
```

### 4. MainLayout Component
**Current:** Basic header/footer layout
**New:**
- Fixed header with YouTube-style gradient
- Optional sidebar for navigation
- Footer with subtle styling
- Main content with proper padding

```tsx
// Header
className="fixed top-0 left-0 right-0 z-50 
           bg-gradient-to-b from-[#181818] to-[#121212] 
           border-b border-white/5"

// Main content
className="pt-20 px-6 pb-6" // Account for fixed header
```

### 5. ProgressIndicator Component
**Current:** Basic progress bar
**New:**
- Animated gradient progress bar
- YouTube red gradient
- Pulse animation during progress
- Status text with icon

```tsx
// Progress bar
className="h-2 bg-white/10 rounded-full overflow-hidden"
// Progress fill
className="h-full bg-gradient-to-r from-red-600 to-red-400 
           rounded-full transition-all duration-500 
           animate-pulse-subtle"
```

### 6. AudioModeSelector Component
**Current:** Basic button group
**New:**
- Pill-style toggle buttons
- Selected state with red background
- Smooth transitions between states
- Icons for each mode

---

## Layout Improvements

### App.tsx Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Header (Fixed)                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🎬 YouTube Downloader                    [Theme Toggle] ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Main Content                                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Download Settings Card                                  ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │ 📁 Path: ~/Downloads/Youtube/Multi                  │││
│  │  │ [Change Path] [Open Folder]                         │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Input Card                                              ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │ Textarea for URLs/Song names                        │││
│  │  │                                                     │││
│  │  │ Search Mode: [Official Audio] [Raw] [Clean]         │││
│  │  │                                                     │││
│  │  │ [Import CSV]              [⬇ Download]              │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Progress Card (when active)                             ││
│  │  ████████████░░░░░░░░░░░░ 45%                           ││
│  │  Processing: Song Name (3 of 10)                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
│  Footer                                                      │
│  YouTube Downloader - Tauri App                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Visual Enhancements

### Animations
1. **Card hover lift**: `transform: translateY(-2px)` on hover
2. **Button press**: Scale down slightly on active
3. **Progress bar**: Subtle pulse animation
4. **Page transitions**: Fade in on mount
5. **Input focus**: Smooth border color transition

### Icons
- Use Lucide icons throughout
- Add YouTube play icon for branding
- Folder, download, upload icons for actions

### Shadows & Effects
- Subtle drop shadows on cards
- Glow effect on primary buttons
- Subtle gradient overlays

---

## Implementation Order

1. **index.css** - Update CSS variables for YouTube color scheme
2. **Card.tsx** - Enhanced card styling with hover effects
3. **Button.tsx** - YouTube-style buttons with gradients
4. **Input.tsx & Textarea.tsx** - Dark theme inputs
5. **MainLayout.tsx** - Fixed header, improved layout
6. **ProgressIndicator** - Animated progress bar
7. **AudioModeSelector** - Pill-style toggle buttons
8. **App.tsx** - Updated layout structure

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Update CSS variables for dark YouTube theme |
| `src/components/ui/Card.tsx` | Add hover effects, gradients |
| `src/components/ui/Button.tsx` | Add YouTube red gradient variants |
| `src/components/ui/Input.tsx` | Dark theme styling |
| `src/components/ui/Textarea.tsx` | Dark theme styling |
| `src/components/layout/MainLayout.tsx` | Fixed header, modern layout |
| `src/App.tsx` | Better visual hierarchy |
| `src/App.css` | Remove old styles, add animations |

---

## Preview

### Before
- Light gray background
- Basic white cards
- Simple buttons
- No visual hierarchy

### After
- Dark YouTube-inspired theme
- Gradient cards with hover effects
- Red accent buttons with shadows
- Clear visual hierarchy
- Smooth animations
- Modern, polished appearance
