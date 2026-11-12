# @repo/ui

Shared design-system components for MovieStore. Consumed as TypeScript source (no build step); styles live globally in `apps/web/src/app/styles/` and are wired in PR 4.

Components are "headless-ish": they render HTML with a stable set of className hooks. The consumer's SCSS owns the actual visuals. This file documents the **className contract** — if you change a classname here, update the matching SCSS in the consumer.

> **Note (until PR 4 ships).** This package does not bundle any CSS. Classes like `button--primary` and `snackbar--error` resolve to nothing until `apps/web/src/app/styles/` defines them. Components render as unstyled HTML in the meantime. This is intentional; PR 4 wires the SCSS pipeline.

## Button

```tsx
import { Button } from "@repo/ui/Button";

<Button variant="primary" isLoading={isSubmitting}>
  Add to cart
</Button>;
```

Props: `variant: "primary" | "secondary" | "danger"` (default `"primary"`), `isLoading`, plus all native `<button>` props. Sets `aria-busy` while loading and `disabled` is forced when loading. `forwardRef` to the button element.

| Class                                                        | When applied      |
| ------------------------------------------------------------ | ----------------- |
| `button`                                                     | always            |
| `button--primary` \| `button--secondary` \| `button--danger` | one per `variant` |
| `button--loading`                                            | while `isLoading` |

## InputField

```tsx
import { InputField } from "@repo/ui/InputField";

<InputField
  label="Email"
  type="email"
  error={errors.email?.message}
  {...register("email")}
/>;
```

Dumb controlled input. Works with `react-hook-form` (`register(...)` or `<Controller render={({field}) => <InputField {...field} />}>`), with native `useState`, or with any other form library. `forwardRef` to the input. Auto-wires `htmlFor`/`id`/`aria-describedby` via `useId()`.

Props: `label` (ReactNode, required), `error?` (string — shows an inline `<p role="alert">`), plus all native `<input>` props.

| Class                | When applied                     |
| -------------------- | -------------------------------- |
| `input-field`        | wrapper, always                  |
| `input-field--error` | wrapper when `error` is set      |
| `input-field__label` | the `<label>`                    |
| `input-field__input` | the `<input>`                    |
| `input-field__error` | the `<p>` with the error message |

## Snackbar

```tsx
import { Snackbar } from "@repo/ui/Snackbar";

<Snackbar
  message="Movie added to cart"
  status="success"
  onClose={() => setVisible(false)}
  action={<Link href="/cart">View cart</Link>}
/>;
```

Auto-dismisses after 3s via `window.setTimeout(onClose)`. `"use client"` component — mounts an effect. Status `"error"` renders as `role="alert"` + `aria-live="assertive"`; others as `role="status"` + `aria-live="polite"`.

Props: `message` (ReactNode), `status?: "success" | "error" | "info"` (default `"success"`), `onClose` (required — consumer controls visibility), `action?` (ReactNode — a link/button rendered after the message).

| Class                                                        | When applied                                |
| ------------------------------------------------------------ | ------------------------------------------- |
| `snackbar`                                                   | always                                      |
| `snackbar--success` \| `snackbar--error` \| `snackbar--info` | one per `status`                            |
| `snackbar__message`                                          | the message span                            |
| `snackbar__action`                                           | the action span (only if `action` provided) |

## PreLoader

```tsx
import { PreLoader } from "@repo/ui/PreLoader";

<PreLoader label="Loading movies…" />;
```

Semantic spinner with `role="status"` + `aria-live="polite"`. The visible spinner is the `.preloader__spinner` element (consumer styles it); the label lives in a visually hidden element so screen readers hear "Loading movies…".

Props: `label?: string` (default `"Loading…"`).

| Class                | When applied                                                           |
| -------------------- | ---------------------------------------------------------------------- |
| `preloader`          | wrapper                                                                |
| `preloader__spinner` | the visual spinner (make it a spinning ring in SCSS)                   |
| `preloader__srOnly`  | the screen-reader-only label (SCSS: `position:absolute; width:1px; …`) |

## NoDataMessage

```tsx
import { NoDataMessage } from "@repo/ui/NoDataMessage";

<NoDataMessage
  message="No movies in this category yet."
  action={<Link href="/">Back to home</Link>}
/>;
```

Empty-state wrapper. Props: `message` (ReactNode), `action?` (ReactNode).

| Class              | When applied                                   |
| ------------------ | ---------------------------------------------- |
| `no-data`          | wrapper                                        |
| `no-data__message` | the `<p>`                                      |
| `no-data__action`  | the action wrapper (only if `action` provided) |
