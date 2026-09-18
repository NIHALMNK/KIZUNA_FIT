# Enterprise Golden Reference Button Component (`Button`)

The `Button` primitive is the foundational interactive trigger control for KIZUNAFIT. It strictly consumes the **Enterprise Design Token System** (`src/styles/tokens/`), adheres to the **UX Pattern Library**, and serves as the **Golden Reference Implementation** for all future shared UI components.

---

## Component API Specification

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'success' \| 'warning' \| 'icon'` | `'primary'` | Visual style variant mapping strictly to semantic design tokens. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size scale controlling height, horizontal padding, gap, and font size. |
| `isLoading` | `boolean` | `false` | When `true`, renders a self-contained SVG spinner, sets `aria-busy="true"`, and blocks interaction. |
| `isDisabled` | `boolean` | `false` | When `true`, applies opacity reduction (`opacity-50`) and sets `aria-disabled="true"`. |
| `loadingText` | `string` | `'Loading...'` | Accessible text label for screen reader live region during loading states. |
| `fullWidth` | `boolean` | `false` | Expands button container width to 100% (`w-full`). |
| `leftIcon` | `React.ReactNode` | `undefined` | Icon primitive rendered before the button label (hidden during loading). |
| `rightIcon` | `React.ReactNode` | `undefined` | Icon primitive rendered after the button label (hidden during loading). |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native HTML button type attribute. |
| `aria-label` | `string` | `undefined` | WAI-ARIA accessible label (mandatory for `icon` variant). |

---

## Usage Examples

### Primary Action
```tsx
import { Button } from '@/shared/components/ui/button';

<Button variant="primary" size="md" onClick={handleSave}>
  Save Changes
</Button>
```

### Async Loading State
```tsx
<Button variant="primary" isLoading loadingText="Saving profile...">
  Save Profile
</Button>
```

### With Icons
```tsx
import { PlusIcon, ArrowRightIcon } from 'lucide-react';

<Button
  variant="secondary"
  leftIcon={<PlusIcon className="h-4 w-4" />}
  rightIcon={<ArrowRightIcon className="h-4 w-4" />}
>
  Add Certification
</Button>
```

### Destructive Action
```tsx
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>
```

### Icon-Only Button
```tsx
import { XIcon } from 'lucide-react';

<Button variant="icon" aria-label="Close dialog" onClick={onClose}>
  <XIcon className="h-4 w-4" />
</Button>
```

---

## Accessibility Checklist & WAI-ARIA Reference

### Accessibility Checklist
- [x] Uses native HTML `<button>` element.
- [x] Includes explicit `type="button"` by default to prevent unexpected form submissions.
- [x] Enforces 2px focus ring (`focus-visible:ring-2 focus-visible:ring-ring`) consuming `--color-input-focus`.
- [x] Supports `prefers-reduced-motion` and motion tokens (`duration-fast`).
- [x] Prevents click events when `isDisabled` or `isLoading` is true.

### Keyboard Support Matrix
| Key | Context | Behavior |
| :--- | :--- | :--- |
| `Tab` | Navigation | Moves focus to the button element. |
| `Shift + Tab` | Navigation | Moves focus to the previous focusable element. |
| `Space` / `Enter` | Focused Button | Triggers the `onClick` event handler. |

### ARIA Reference Table
| Attribute | Dynamic Value | Purpose |
| :--- | :--- | :--- |
| `aria-disabled` | `effectiveDisabled` (`boolean`) | Informs assistive technology when button interaction is blocked. |
| `aria-busy` | `isLoading` (`boolean`) | Informs screen readers that async operation is actively in flight. |
| `aria-live` | `'polite'` | Live region announcing loading status changes. |
| `aria-hidden` | `'true'` | Applied to SVG icons and spinners to prevent redundant reader announcements. |

---

## Workspace Theme Support

The Button component automatically adapts its semantic color mapping based on the active root workspace theme class:

* **`.theme-public`**: Primary maps to Royal Blue (`var(--primitive-blue-600)`).
* **`.theme-client`**: Primary maps to Ocean Cyan (`var(--primitive-cyan-600)`).
* **`.theme-trainer`**: Primary maps to Deep Emerald (`var(--primitive-emerald-600)`).
* **`.theme-admin`**: Primary maps to Royal Indigo (`var(--primitive-indigo-600)`).
* **`.dark`**: Automatically adjusts surfaces and contrast ratios for low-light environments.

---

## Do's and Don'ts

### ✅ DO
* Use `variant="primary"` for the single primary page call-to-action.
* Use `variant="danger"` for destructive data removal actions.
* Supply an explicit `aria-label` when rendering icon-only buttons (`variant="icon"`).
* Use `isLoading` and `isDisabled` props for state controls.

### ❌ DON'T
* Do NOT use raw inline styles or arbitrary hex colors (e.g. `bg-[#2563EB]`).
* Do NOT introduce external UI component dependencies inside the Button primitive.
* Do NOT render multiple `primary` buttons within the same visual section.
* Do NOT use buttons as hyperlinks for route navigation; use Next.js `Link` instead.
