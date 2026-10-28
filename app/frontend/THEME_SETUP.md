# Dark Mode Implementation

This document explains the dark/light mode implementation using Tailwind CSS and Next.js themes.

## Features

✓ **Toggle Button** - Located in the top-right corner of the page
✓ **Theme Persistence** - User preference saved in local storage (`app-theme`)
✓ **System Detection** - Falls back to system preference if no saved preference
✓ **Smooth Transitions** - CSS transitions for theme changes
✓ **Tailwind Integration** - Uses Tailwind's built-in `dark:` utilities

## Architecture

### Dependencies

- **`next-themes`** - Manages theme state and persistence
- **`tailwindcss`** - Provides styling with dark mode support
- **`react-icons`** - Icon library for theme toggle (sun/moon icons)

### Key Files

1. **[src/app/providers.tsx](src/app/providers.tsx)**
   - `ThemeProvider` wrapper component
   - Configures storage key: `app-theme`
   - Enables system preference detection

2. **[src/components/ThemeToggle.tsx](src/components/ThemeToggle.tsx)**
   - Theme toggle button component
   - Uses `useTheme` hook to access/set theme
   - Shows different icons for light/dark modes
   - Includes hydration safety with `mounted` state

3. **[src/app/layout.tsx](src/app/layout.tsx)**
   - Wrapped with `Providers` component
   - Added `suppressHydrationWarning` to prevent warnings

4. **[src/app/globals.css](src/app/globals.css)**
   - Tailwind directives (`@tailwind`)
   - CSS variables for colors
   - Dark mode styles using `html.dark` selector

5. **[tailwind.config.ts](tailwind.config.ts)**
   - Dark mode configured with `class` strategy
   - Scans content from `src/` directories

6. **[postcss.config.ts](postcss.config.ts)**
   - Tailwind and Autoprefixer configuration

## How It Works

### Theme Detection

The app uses this priority order:

1. **Saved preference** (local storage key: `app-theme`)
2. **System preference** (if `defaultTheme="system"`)
3. **Light mode** (fallback)

### Styling with Dark Mode

Use Tailwind's `dark:` prefix for dark-mode specific styles:

```tsx
<div className="bg-white dark:bg-gray-900">
  Light mode white, dark mode gray
</div>
```

### Toggle Implementation

```tsx
import { useTheme } from 'next-themes'

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

## Local Storage

Theme preference is stored in `localStorage['app-theme']` with values:

- `'light'` - Light mode
- `'dark'` - Dark mode
- `'system'` - Use system preference (default)

## Hydration Safety

The `ThemeToggle` component includes hydration safety:

```tsx
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return <Skeleton />
```

This prevents hydration mismatches between server and client.

## CSS Variables

Dark mode colors are controlled by CSS variables:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

html.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

## Testing

To test the implementation:

1. Start the dev server: `npm run dev`
2. Visit http://localhost:3000
3. Click the theme toggle button (top-right)
4. Refresh the page - your preference is restored
5. Open DevTools → Application → Local Storage → `app-theme`

## Customization

### Change Theme Storage Key

Edit `src/app/providers.tsx`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  storageKey="my-custom-key" // Change this
>
```

### Add More Theme Options

Extend `tailwind.config.ts` colors:

```ts
theme: {
  extend: {
    colors: {
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
    },
  },
}
```

### Change Dark Mode Strategy

Options in `tailwind.config.ts`:

- `'class'` - Uses HTML class (current)
- `'media'` - Uses system preference only
- `['class', 'media']` - Try class first, then media

## Browser Support

Works in all modern browsers with:

- CSS custom properties support
- Local Storage API
- ES6+ JavaScript features

## Troubleshooting

### Theme not persisting?

- Check browser local storage is enabled
- Verify storage key in DevTools → Application → Local Storage
- Clear localStorage and reload

### Flash of wrong theme on page load?

- This is normal with client-side hydration
- Use the included `mounted` state pattern in components

### Icons not showing?

- Ensure `react-icons` is installed: `npm install react-icons`
- Check imports: `import { MdDarkMode } from 'react-icons/md'`

## Future Enhancements

- [ ] Add theme selection dropdown (light/dark/system)
- [ ] Support for additional themes (e.g., auto, sepia)
- [ ] Animate between theme transitions
- [ ] Store per-component theme preferences
