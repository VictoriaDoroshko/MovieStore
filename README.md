# MovieStore

Turborepo monorepo: Next.js 16 (App Router) storefront + Express/Firebase API. Migration target for the legacy React 18 codebase in `LegacyMovieStore/`.

**All architectural conventions:** [docs/CONVENTIONS.md](docs/CONVENTIONS.md).

## Apps and packages

- `apps/web` — Next.js 16 storefront, FSD under `apps/web/src/{app,widgets,features,entities,shared}`
- `apps/api` — Express + Firebase backend (added in PR 2), port 5001
- `apps/docs` — docs site
- `@repo/ui` — shared design system (Button, InputField, Snackbar, PreLoader, …)
- `@repo/eslint-config` — `base` / `next-js` / `react-internal` / `fsd` presets
- `@repo/typescript-config` — tsconfig presets

Everything is TypeScript. Package manager: pnpm. Node ≥24.

## Tooling

- **Vitest** for tests, per-workspace, aggregated by `turbo run test`.
- **ESLint** with `eslint-plugin-boundaries` to enforce FSD layer imports.
- **Prettier** for formatting (run via `lint-staged` on commit).
- **Husky** hooks: `pre-commit` (lint-staged), `commit-msg` (commitlint), `pre-push` (`turbo run check-types lint test`).
- **commitlint** with [Conventional Commits](https://www.conventionalcommits.org) + scoped to `web | api | ui | eslint-config | typescript-config | deps | repo`.
- **AI tooling:** Claude Code reads `CLAUDE.md` + `.claude/skills/*`; Cursor reads `.cursor/rules/*`. Both reference `docs/CONVENTIONS.md` to avoid drift.

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
turbo build
```

Without global `turbo`, use your package manager:

```sh
npx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
turbo dev
```

Without global `turbo`, use your package manager:

```sh
npx turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
turbo login
```

Without global `turbo`, use your package manager:

```sh
npx turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
