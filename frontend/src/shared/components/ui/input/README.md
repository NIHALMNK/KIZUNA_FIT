# Enterprise Input Component (`Input`)

The `Input` primitive is the second **Golden Reference Component** for KIZUNAFIT. It provides standardized data entry controls, explicit status messaging, icon/prefix support, and WAI-ARIA form accessibility while consuming the **Enterprise Design Token System** (`src/styles/tokens/`).

---

## Component API Specification

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'filled' \| 'outline' \| 'ghost'` | `'default'` | Visual container variant mapping strictly to semantic design tokens. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size scale controlling height, padding, font size, and icon dimensions. |
| `label` | `React.ReactNode` | `undefined` | Accessible label displayed above the input field. |
| `helperText` | `React.ReactNode` | `undefined` | Contextual hint or description text displayed below the input. |
| `error` | `boolean \| string` | `undefined` | Error status or explicit error message string (renders below input in `--color-danger`). |
| `success` | `boolean \| string` | `undefined` | Success status or success message string (renders below input in `--color-success`). |
| `warning` | `boolean \| string` | `undefined` | Warning status or warning message string (renders below input in `--color-warning`). |
| `isDisabled` | `boolean` | `false` | When `true`, disables interaction and applies muted opacity styling. |
| `isRequired` | `boolean` | `false` | When `true`, renders a red asterisk (`*`) and sets `aria-required="true"`. |
| `isReadOnly` | `boolean` | `false` | When `true`, prevents editing while retaining focusable state. |
| `fullWidth` | `boolean` | `false` | Expands input container width to 100% (`w-full`). |
| `leftIcon` | `React.ReactNode` | `undefined` | Icon primitive rendered inside the input on the left. |
| `rightIcon` | `React.ReactNode` | `undefined` | Icon primitive rendered inside the input on the right. |
| `prefix` | `React.ReactNode` | `undefined` | Static text or element prefix rendered inside input before leftIcon. |
| `suffix` | `React.ReactNode` | `undefined` | Static text or element suffix rendered inside input after rightIcon. |
| `isClearable` | `boolean` | `false` | When `true` and input has a value, renders a clear button (`X` icon). |
| `onClear` | `() => void` | `undefined` | Callback function executed when clear button is clicked. |
| `containerClassName` | `string` | `undefined` | Custom CSS class names applied to the outer field wrapper. |
| `inputClassName` | `string` | `undefined` | Custom CSS class names applied directly to the `<input>` HTML element. |

---

## Usage Examples

### Standard Field with Label & Helper Text
```tsx
import { Input } from '@/shared/components/ui/input';

<Input
  label="Email Address"
  placeholder="name@example.com"
  helperText="We will send your verification link here."
  isRequired
/>
```

### Validation Error State
```tsx
<Input
  label="Password"
  type="password"
  error="Password must contain at least 8 characters."
  isRequired
/>
```

### With Prefix & Suffix
```tsx
<Input
  label="Hourly Training Rate"
  prefix="$"
  suffix="USD / hr"
  placeholder="75.00"
  type="number"
/>
```

### With Icons & Clear Button
```tsx
import { SearchIcon } from 'lucide-react';

<Input
  leftIcon={<SearchIcon className="h-4 w-4" />}
  placeholder="Search trainers by name or specialization..."
  isClearable
  value={searchValue}
  onClear={() => setSearchValue('')}
/>
```

---

## Accessibility (a11y)

* **Label Association**: Automatically generates a unique `id` via React `useId` to associate `<label htmlFor="...">` with `<input id="...">`.
* **Describedby Linking**: Dynamically links `aria-describedby` to the helper text or error message container ID.
* **Error Announcements**: Helper text container sets `role="alert"` when displaying error messages.
* **Validation Attributes**: Sets `aria-invalid="true"` when `error` is truthy, and `aria-required="true"` when `isRequired` is true.
* **Focus Ring**: Applies a 2px focus ring (`focus-within:ring-2 focus-within:ring-ring`) consuming `--color-input-focus`.

---

## Do's and Don'ts

### ✅ DO
* Always supply a `label` or `aria-label` for screen reader users.
* Use `error` strings directly from React Hook Form or Zod validation errors.
* Use `prefix` and `suffix` for structured formats (currency, URLs, domains).
* Set `isRequired` on mandatory form fields.

### ❌ DON'T
* Do NOT use raw inline styles or hardcoded border/text colors (e.g. `border-[#cbd5e1]`).
* Do NOT mix business logic or API calls inside the Input primitive.
* Do NOT use `<Input>` for multi-line text input; use `<Textarea>` instead.
* Do NOT hide focus rings or break keyboard navigation.
