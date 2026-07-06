# 17. DESIGN SYSTEM

## 1. Design Tokens

The KIZUNAFIT design system relies on a set of semantic tokens mapped to CSS variables (defined in `globals.css`). This allows seamless integration with Tailwind CSS and immediate light/dark mode toggling.

### Colors
- **Background**: `bg-background` (Pure white in light, `#0C0C0C` in dark).
- **Foreground**: `text-foreground` (Nearly black in light, nearly white in dark).
- **Primary**: Brand color `bg-primary`, `text-primary`.
- **Secondary**: Muted brand accents.
- **Muted**: Used for secondary text, disabled states, and skeleton backgrounds.
- **Destructive**: Used for error states, destructive actions (e.g., Delete Account).
- **Border / Input / Ring**: Utility colors for structural UI elements.

### Typography
- **Font Family**: Inter (via Next.js `next/font/google`).
- **Scale**: Relies on default Tailwind scale (`text-xs` through `text-9xl`).

### Radius & Spacing
- **Radius**: Base `--radius` is `0.5rem` (`rounded-md`). Buttons and cards automatically inherit this.
- **Spacing**: Follows standard 4px Tailwind grid.

## 2. Component Standards

Every UI component in KIZUNAFIT MUST follow these rules:
1. **No Business Logic**: Shared UI components must never fetch data, know about Redux/Zustand, or import from `modules/`.
2. **Forward Refs**: All components must wrap their JSX in `React.forwardRef` to allow compositional behavior (like tooltips or dropdowns).
3. **Class Merging**: Every component must accept a `className` prop and merge it using the `cn()` utility (`clsx` + `tailwind-merge`) to allow overrides safely without specificity conflicts.
4. **Variants**: Use `class-variance-authority` (cva) for complex components like Buttons or Badges to strongly type visual states.

## 3. Accessibility Rules

- **Focus Rings**: All interactive elements MUST utilize `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` to support keyboard navigation.
- **Contrast**: `primary-foreground` and `destructive-foreground` MUST maintain WCAG AA contrast ratios against their respective backgrounds.
- **Aria Labels**: Any icon-only button must include an `aria-label` or visually hidden text.

## 4. Component Variants

- **Button**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
- **Badge**: `default`, `secondary`, `destructive`, `outline`.
- **Sizes**: Defined locally (e.g., Button supports `sm`, `default`, `lg`, `icon`).

## 5. Dark Mode Strategy

Dark mode is handled entirely via CSS Variables.
1. The `ThemeProvider` injects the `.dark` class onto the `<html>` element based on user preference or system matchMedia.
2. The CSS variables in `globals.css` redefine the HSL values for the dark theme.
3. Tailwind automatically applies the dark colors without needing explicit `dark:bg-black` utility classes in the React code.

## 6. Responsive Strategy

The design system is mobile-first.
- Base classes apply to mobile (e.g., `flex-col`).
- Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) are used to scale up layouts.
- Shared structural components (`Container`, `Section`) handle the primary max-width and horizontal padding clamping to ensure content never bleeds to the screen edge on ultrawide monitors.
