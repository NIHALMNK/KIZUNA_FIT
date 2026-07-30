# Enterprise Label Component (`Label`)

The `Label` primitive is the third **Golden Reference Component** for KIZUNAFIT. It provides standardized form field labeling, mandatory field indicators (`*`), optional tag badges (`(optional)`), and status state typography while strictly consuming the **Enterprise Design Token System** (`src/styles/tokens/`).

---

## Component API Specification

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size scale controlling typography size, weight, and indicator spacing. |
| `htmlFor` | `string` | `undefined` | HTML ID of the target input control associated with this label. |
| `isRequired` / `required` | `boolean` | `false` | When `true`, renders a red asterisk (`*`) indicator for mandatory fields. |
| `isOptional` / `optional` | `boolean` | `false` | When `true`, renders a muted `(optional)` badge tag for non-mandatory fields. |
| `isDisabled` / `disabled` | `boolean` | `false` | When `true`, applies muted opacity and disables pointer events. |
| `error` | `boolean \| string` | `false` | Applies error state typography styling (`--color-danger`). |
| `success` | `boolean \| string` | `false` | Applies success state typography styling (`--color-success`). |
| `warning` | `boolean \| string` | `false` | Applies warning state typography styling (`--color-warning`). |
| `className` | `string` | `undefined` | Custom CSS class names override. |
| `children` | `React.ReactNode` | `undefined` | Label text or embedded elements. |

---

## Usage Examples

### Standard Label
```tsx
import { Label } from '@/shared/components/ui/label';

<Label htmlFor="email-input">
  Email Address
</Label>
```

### Required Mandatory Field Label
```tsx
<Label htmlFor="password-input" isRequired>
  Password
</Label>
```

### Optional Field Label
```tsx
<Label htmlFor="bio-input" isOptional>
  Biography
</Label>
```

### Validation Error State Label
```tsx
<Label htmlFor="email-input" error>
  Email Address
</Label>
```

---

## Accessibility (a11y)

* **Semantic HTML**: Renders a native `<label>` element.
* **Input Association**: Explicitly accepts `htmlFor` matching the associated input's `id`.
* **Screen Reader Hygiene**: Mandatory asterisk (`*`) and optional badges (`(optional)`) set `aria-hidden="true"` so screen readers rely on native `aria-required` / `aria-invalid` on the input control itself.
* **Disabled States**: Sets `aria-disabled="true"` when disabled.

---

## Do's and Don'ts

### ✅ DO
* Always provide `htmlFor` linking to the unique `id` of the target form input control.
* Use `isRequired` for mandatory fields to provide visual parity with `aria-required`.
* Use `isOptional` when a form section consists mostly of required fields.
* Maintain consistent size scaling (`sm`, `md`, `lg`) matching adjacent inputs.

### ❌ DON'T
* Do NOT use raw inline styles or arbitrary text colors (e.g. `text-[#ef4444]`).
* Do NOT replace native browser `<label>` elements with arbitrary `<div>` or `<span>` tags.
* Do NOT nest interactive click handlers inside `<label>` tags.
