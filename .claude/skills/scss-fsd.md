---
name: scss-fsd
description: SCSS module layout under FSD — global tokens vs colocated component styles. Load before writing or renaming a .scss file.
---

# SCSS in FSD

Two layers only: globals and modules. No per-feature mega-stylesheets.

## Globals

`apps/web/src/app/styles/`:

```
variables.scss    colors, spacing, typography, breakpoints — CSS custom properties
globals.scss      resets, body defaults, imports variables.scss
```

Imported once in `src/app/layout.tsx`:

```ts
import "./styles/globals.scss";
```

## Component modules

Colocated next to the component, same stem:

```
features/cart/ui/
  CartItem.tsx
  CartItem.module.scss
```

Usage:

```tsx
import styles from "./CartItem.module.scss";
<div className={styles.item}>…</div>;
```

## Rules

- No global class names from a module — only via `.module.scss`.
- Media queries use variables from `variables.scss`, no magic pixel values in modules.
- Shared mixins live in `src/app/styles/mixins.scss` (create when the second component needs the same one, not before).
- No inline `style={}` except runtime-only values (`style={{ height: chart.height }}`).
