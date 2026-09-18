# Enterprise Card Component System (`Card`)

The `Card` primitive system is the fourth **Golden Reference Component** for KIZUNAFIT. It provides the structured container foundation for Authentication flows (Login, Register, Password Reset), User Dashboards, Marketplace Cards, Analytics widgets, and Profile views while consuming the **Enterprise Design Token System** (`src/styles/tokens/`).

---

## Sub-Components Breakdown

| Component | Element | Description |
| :--- | :--- | :--- |
| `<Card>` | `<div>` | Outer card container handling variant styles, elevation, padding scale, and border radii. |
| `<CardHeader>` | `<div>` | Top section wrapper for title and description header landmarks. |
| `<CardTitle>` | `<h3>` | Primary title typography element inside CardHeader. |
| `<CardDescription>` | `<p>` | Contextual subtitle typography element inside CardHeader. |
| `<CardContent>` | `<div>` | Flexible flex-1 body content container for form fields, data tables, or charts. |
| `<CardFooter>` | `<div>` | Bottom action bar wrapper for submit buttons, metadata, or navigation links. |

---

## Component API Specification

### `<Card>` Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'outlined' \| 'filled' \| 'elevated' \| 'ghost'` | `'default'` | Visual container style mapping strictly to semantic design tokens. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size scale controlling internal padding, border radius, and gap. |
| `className` | `string` | `undefined` | Custom CSS class names override. |
| `children` | `React.ReactNode` | `undefined` | Card sub-components and body content. |

---

## Usage Examples

### Authentication Form Card
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

export const LoginForm = () => (
  <Card variant="default" size="lg" className="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle>Welcome Back</CardTitle>
      <CardDescription>Sign in to your KIZUNAFIT workspace</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <Input label="Email Address" type="email" placeholder="name@example.com" isRequired />
      <Input label="Password" type="password" isRequired />
    </CardContent>
    <CardFooter>
      <Button variant="primary" fullWidth>
        Sign In
      </Button>
    </CardFooter>
  </Card>
);
```

### Elevated Marketplace Widget
```tsx
<Card variant="elevated" size="md">
  <CardHeader>
    <CardTitle>Certified Fitness Trainer</CardTitle>
    <CardDescription>Specializing in Strength & Conditioning</CardDescription>
  </CardHeader>
  <CardContent>
    <p>5+ years of personal coaching experience.</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary" size="sm">
      Book Consultation
    </Button>
  </CardFooter>
</Card>
```

---

## Accessibility (a11y) & Semantic Landmarks

* **Semantic Sectioning**: Supports wrapping in `<section>` or `<article>` via standard HTML prop forwarding or `as` landmarks.
* **Role Support**: Explicitly supports `role="region"`, `role="article"`, or `role="dialog"` for assistive technologies.
* **Screen Reader Hierarchy**: Uses structured `<h3>` heading tags for `<CardTitle>` to maintain clear outline hierarchy.
* **Focus Management**: Elevated and interactive cards maintain visible focus rings (`focus-visible:ring-2 focus-visible:ring-ring`).

---

## Do's and Don'ts

### ✅ DO
* Compose Cards using `<CardHeader>`, `<CardContent>`, and `<CardFooter>` for structural consistency across all pages.
* Use `variant="elevated"` for interactive cards that benefit from visual hierarchy and shadow depth.
* Use `variant="outlined"` for subtle grid cards or form containers on light backgrounds.
* Keep action buttons placed inside `<CardFooter>`.

### ❌ DON'T
* Do NOT hardcode inline styles, raw background colors, or magic box shadows (`shadow-[0_10px_15px_rgba(0,0,0,0.1)]`).
* Do NOT place raw business logic or network API state directly inside Card primitives.
* Do NOT nest cards deeper than 2 levels; use dividers or flat containers instead.
