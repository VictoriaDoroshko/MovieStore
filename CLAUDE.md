# MovieStore — Claude Code project context

A Turborepo monorepo: Next.js 16 (App Router) + Express + Firebase. Migration target for the legacy React 18 + Webpack + Recoil `LegacyMovieStore` codebase.

**All architectural rules live in [docs/CONVENTIONS.md](docs/CONVENTIONS.md).** This file is the single source of truth — read it before suggesting code structure, imports, state management, forms, styles, or commits. The files under `.claude/skills/` zoom in on specific recipes but defer to CONVENTIONS.md for principles.

## Workspace map

- `apps/web` — Next.js 16 storefront. FSD under `apps/web/src/{app,widgets,features,entities,shared}`.
- `apps/api` — Express + Firebase backend (added in PR 2). Port 5001.
- `apps/docs` — Turborepo starter docs; may host component showcases later.
- `packages/ui` — `@repo/ui`, shared design system.
- `packages/eslint-config` — ESLint presets: `base`, `next-js`, `react-internal`, `fsd` (boundaries).
- `packages/typescript-config` — tsconfig presets.

## Everyday commands

```sh
pnpm turbo run dev           # web (3000) + api (5001) in parallel
pnpm turbo run lint          # eslint across the repo (includes FSD boundaries)
pnpm turbo run check-types
pnpm turbo run test          # vitest
pnpm turbo run build
```

Branch work follows the PR plan in `/Users/viktoriia/.claude/plans/pet-project-glimmering-raven.md`.

## Skills

Load the matching skill before you write code in that area:

- [fsd-boundaries](.claude/skills/fsd-boundaries.md) — layer imports, slice layout
- [rtk-query-pattern](.claude/skills/rtk-query-pattern.md) — endpoints, tags, invalidation
- [zod-form-pattern](.claude/skills/zod-form-pattern.md) — RHF + Zod + optimistic
- [scss-fsd](.claude/skills/scss-fsd.md) — colocated modules + global tokens
- [server-vs-client](.claude/skills/server-vs-client.md) — RSC vs `"use client"`
- [api-workspace](.claude/skills/api-workspace.md) — adding Express routes + Firebase

## Guardrails

- Never `--no-verify` to bypass husky; fix the underlying lint/type/test failure.
- Never commit `serviceAccountKey.json`, `.env.local`, or any file with secrets.
- Attribution lines on commits/PRs follow the system reminder in effect; do not add extra signatures.
