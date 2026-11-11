---
name: api-workspace
description: Add Express routes and Firestore access in apps/api. Load before touching anything under apps/api/src.
---

# apps/api — Express + Firebase Admin

Added in PR 2 as a separate workspace. Port 5001.

## Layout

```
apps/api/src/
  server.ts             app.listen, mounts routers
  firebaseConfig.ts     admin.initializeApp + export db, admin
  routes/               thin: wire URL → controller
  controllers/          business logic, Firestore queries
  dto/                  request/response shapes
  middlewares/          cors, error handler, auth (future)
  types.ts              shared TS types
```

## New endpoint recipe

1. DTO in `dto/<feature>Dto.ts` — the request body + response shape.
2. Controller method in `controllers/<feature>Controller.ts` — Firestore read/write, return typed response.
3. Route in `routes/<feature>Routes.ts` — one line binding path + method to controller.
4. Mount in `server.ts` with `app.use("/<feature>", <feature>Routes)`.
5. Add a matching endpoint in the web's `features/<slice>/api/<slice>Api.ts` (RTK Query).

## Firestore access

```ts
import { db } from "../firebaseConfig";

export const getMovieBySlug = async (slug: string) => {
  const snap = await db
    .collection("movies")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};
```

Always `.limit(1)` or `.limit(n)` on queries — unbounded Firestore reads bill fast.

## Secrets

- `serviceAccountKey.json` and `.env*` are in `.gitignore`. Never commit.
- Keep `apps/api/.env.example` current with every required var name (no values).
- Reading env: `process.env.FIREBASE_DATABASE_URL`. Validate presence at boot in `firebaseConfig.ts`.
