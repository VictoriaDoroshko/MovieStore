# MovieStore conventions

Single source of truth for code rules. Both `.claude/skills/*` and `.cursor/rules/*` reference this file so the rules never drift out of sync.

## Monorepo layout

```
apps/
  web/        Next.js 16 (App Router) — the storefront
  api/        Express + Firebase — REST backend (added in PR 2)
  docs/       documentation site
packages/
  ui/         @repo/ui — shared design system (Button, InputField, Snackbar, PreLoader, …)
  eslint-config/      @repo/eslint-config — base/next-js/react-internal/fsd presets
  typescript-config/  @repo/typescript-config — base/nextjs/react-library tsconfigs
docs/         markdown docs including this file
```

## Feature-Sliced Design (apps/web)

Source lives in `apps/web/src/`, split into layers from highest to lowest:

```
app         Next.js routes, root layout, providers, error boundary
widgets     composite blocks assembled from features/entities (Header, CartDrawer)
features    user-facing capabilities (catalog, cart, checkout, notifications)
entities    business nouns (movie, order) with model + ui, no side effects
shared      framework-agnostic utilities (api base, ui primitives via @repo/ui, config)
```

**Import rule, enforced by `eslint-plugin-boundaries` ([fsd.js](../packages/eslint-config/fsd.js)):** a layer may import only from strictly lower layers. `shared` may import from `shared`. Everything else is forbidden.

Inside a slice, layout is `model/` (types, slices, hooks), `ui/` (React components), `api/` (RTK Query endpoints), `lib/` (pure helpers). Only `ui` and `api` are re-exported from the slice's `index.ts`.

## State management

- Global state: Redux Toolkit. Store in `shared/store/store.ts`.
- Async state: RTK Query. One API per feature (`features/<slice>/api/<slice>Api.ts`), split from `shared/api/baseApi.ts`.
- Cache invalidation: tags. Mutations call `invalidatesTags`, queries declare `providesTags`.
- Persist: `redux-persist`, whitelist `cart` only. Never persist `rtk-query` or `notifications`.
- Optimistic updates for mutations that touch cart or checkout. Rollback on `onQueryStarted` rejection.

## Forms

React Hook Form + Zod. One schema per form, both TS type (`z.infer<typeof schema>`) and validator come from it.

```ts
const schema = z.object({ email: z.string().email() });
type Values = z.infer<typeof schema>;
const form = useForm<Values>({ resolver: zodResolver(schema) });
```

## Next.js App Router

- Server Components by default. `"use client"` only when the component uses hooks, event handlers, or browser-only APIs.
- Catalog list and movie page use ISR: `export const revalidate = 60`.
- Browser-only third-party widgets (react-slick, charts) → `widgets/` with `dynamic(() => import(...), { ssr: false })`.
- Root error boundary at `src/app/error.tsx`. Route-level boundaries only if a route has unique failure modes.

## Styles

SCSS. Global tokens (colors, spacing, typography, breakpoints) in `src/app/styles/variables.scss`, imported by `src/app/styles/globals.scss`. Component styles colocated as `<Component>.module.scss`. No inline styles outside of one-off runtime values (chart dimensions, etc.).

## Commits

Conventional Commits, enforced by `commitlint`:

```
<type>(<scope>): <subject>

[body]

[footer]
```

- `type`: `feat | fix | chore | docs | refactor | test | perf | ci | build | style | revert`
- `scope`: `web | api | ui | eslint-config | typescript-config | deps | repo` (see [commitlint.config.js](../commitlint.config.js))
- `subject`: imperative, lowercase, no trailing dot. Under 72 chars.

## Git hooks

Managed by husky, configured in `.husky/`:

| Hook         | What runs                                | Why                                                  |
| ------------ | ---------------------------------------- | ---------------------------------------------------- |
| `pre-commit` | `lint-staged` (prettier on staged files) | Fast local gate; formatting only                     |
| `commit-msg` | `commitlint --edit $1`                   | Reject commits that don't match the format           |
| `pre-push`   | `turbo run check-types lint test`        | Expensive gate; everything must pass before upstream |

Never `--no-verify` or `--no-gpg-sign` for convenience. Fix the underlying issue.

## Testing

Vitest. Co-located as `<file>.test.ts(x)`. First tests target the riskiest pure logic (`cartSlice` reducer, Zod schemas, API transforms). Component tests only where behavior is non-trivial.

## Backend (apps/api, added in PR 2)

- Express + Firebase Admin, port 5001.
- `serviceAccountKey.json` is **never committed**. Keep a `.env.example` with required env var names.
- Routes stay thin; business logic in controllers.
