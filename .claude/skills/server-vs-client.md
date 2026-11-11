---
name: server-vs-client
description: Decide RSC vs Client Component in apps/web (App Router). Load before adding a page.tsx, layout.tsx, or any new component.
---

# Server vs Client components

Default to **Server**. Opt into Client only when you need one of the client-only capabilities.

## Server (no directive)

- Data fetching with `fetch`, Firebase Admin SDK on the server, direct DB access.
- Rendering static markup, SEO-critical content.
- Static or ISR pages: add `export const revalidate = <seconds>;`.
- Example: `src/app/page.tsx` (catalog grid), `src/app/category/[slug]/page.tsx`.

## Client (`"use client"` at the top)

- Any React hook (`useState`, `useReducer`, `useContext`, `useEffect`, Redux hooks, RTKQ hooks).
- Event handlers (`onClick`, `onChange`, `onSubmit`).
- Browser APIs (`window`, `localStorage`, Intersection Observer).
- Third-party libs that touch `window` during import (react-slick, chart libs). Wrap in `dynamic(..., { ssr: false })` from inside a client file.
- Example: `features/checkout/ui/CheckoutForm.tsx`, `widgets/cart-drawer`.

## Server fetches, Client renders

Common pattern for ISR + interactivity:

```tsx
// src/app/category/[slug]/page.tsx  (Server)
import { CategoryGrid } from "features/catalog/ui/CategoryGrid";
export const revalidate = 60;

export default async function Page({ params }: { params: { slug: string } }) {
  const movies = await fetch(
    `${process.env.API_URL}/categories/${params.slug}/movies`,
    {
      next: { revalidate: 60 },
    },
  ).then((r) => r.json());
  return <CategoryGrid movies={movies} />;
}
```

```tsx
// features/catalog/ui/CategoryGrid.tsx  (Client — needs onClick/addToCart)
"use client";
export const CategoryGrid = ({ movies }: { movies: Movie[] }) => { … };
```

Data is fetched on the server (cacheable, SEO-friendly), interaction stays on the client. Don't mark the page client just to get interactivity — push `"use client"` down to the smallest leaf that needs it.

## Anti-patterns

- `"use client"` on a layout or a top-level page — this pulls the whole subtree into the client bundle.
- Importing a server-only module (`firebase-admin`, `fs`) from a client file. The build will fail; fix by moving the import to a Route Handler or Server Component.
