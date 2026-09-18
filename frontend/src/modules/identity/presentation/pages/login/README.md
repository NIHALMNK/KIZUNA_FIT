# Enterprise Identity Login Page (`LoginPage`)

The `LoginPage` is the first production-ready full page implementation in KIZUNAFIT. It consumes the four **Golden Reference UI Primitives** (`Button`, `Input`, `Label`, `Card`) and integrates directly with the **Identity Domain Architecture** (`useLogin`, `authStore`, `loginSchema`, `HttpClient`).

---

## Shared Primitives Consumed

| Component | Shared Primitive Path | Purpose |
| :--- | :--- | :--- |
| `<Card>` | `@/shared/components/ui/card` | Form card container (`variant="default"`, `size="lg"`). |
| `<Input>` | `@/shared/components/ui/input` | Email and password input fields with inline validation error announcements. |
| `<Label>` | `@/shared/components/ui/label` | Mandatory password field label linked to input `id`. |
| `<Button>` | `@/shared/components/ui/button` | Primary submission action (`isLoading={loginMutation.isPending}`). |

---

## Form Validation & Domain Binding

* **Form Library**: `react-hook-form` + `@hookform/resolvers/zod`.
* **Validation Schema**: `loginSchema` (`src/modules/identity/presentation/validation/authSchemas.ts`).
* **Validation Trigger**: `onTouched` mode with immediate `onChange` re-validation.

---

## Error Handling Strategy

1. **Client Field Errors**: Displayed directly below each field via `Input`'s built-in `error` prop.
2. **Backend Validation Errors**: Automatically mapped to form fields via `handleValidationErrors(error, setError)`.
3. **Authentication Failures / Network Errors**: Announced via `sonner` toast notifications using `getFriendlyMessage(error)`.

---

## Success Redirect Flow

Upon successful login:
1. Access token saved to memory via `TokenStorage.ts`.
2. Auth state set via `useAuthStore.setAuthenticated(token)`.
3. Success toast notification displayed.
4. User automatically navigated to role workspace route (`/client`, `/trainer`, `/admin`) via Next.js `useRouter`.

---

## Accessibility Features

* [x] Form container wrapped inside semantic `<form noValidate>`.
* [x] Inputs linked to labels via unique HTML IDs.
* [x] Password Show/Hide toggle button with dynamic `aria-label` ("Show password" / "Hide password").
* [x] Keyboard navigable via `Tab`, `Enter`, and `Space`.
* [x] Screen-reader live regions for validation error messages (`role="alert"`).
