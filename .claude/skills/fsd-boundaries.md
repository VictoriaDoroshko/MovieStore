---
name: fsd-boundaries
description: Enforce FSD layer imports in apps/web. Load before adding a file under src/ or wiring an import across layers.
---

# FSD boundaries

See [docs/CONVENTIONS.md](../../docs/CONVENTIONS.md) for the full picture. Quick reference:

```
app       ← widgets ← features ← entities ← shared
```

A layer may import from strictly lower layers. `shared → shared` is fine. Everything else is a boundary violation and the lint rule in [`packages/eslint-config/fsd.js`](../../packages/eslint-config/fsd.js) will reject the PR.

## Allowed

```ts
// features/cart/ui/CartButton.tsx
import { Button } from "@repo/ui/button"; // shared-ish (external pkg)
import type { Movie } from "entities/movie"; // lower layer
import { cartApi } from "features/cart/api/cartApi"; // same slice
```

## Forbidden

```ts
// entities/movie/ui/MovieCard.tsx
import { addToCart } from "features/cart/model/cartSlice"; // ✗ entities → features
```

Fix: hoist the UI that needs the action one layer up (into `features/catalog/ui/MovieGrid.tsx`) and pass the handler in as a prop. Entities stay pure.

## Slice internal layout

```
features/<slice>/
  api/<slice>Api.ts     RTK Query endpoints
  model/                slice, hooks, selectors, types
  ui/                   React components
  lib/                  pure helpers (if any)
  index.ts              re-exports ui + api only
```

Never import across slices directly. If `features/checkout` needs `features/cart` state, both talk through `entities/order` or through the Redux store via selectors — not direct imports.
