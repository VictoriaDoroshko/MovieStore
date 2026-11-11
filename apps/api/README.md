# @moviestore/api

Express + Firebase Admin backend for MovieStore. Serves REST endpoints for movies, categories, cart, and orders.

## Setup

1. Copy `.env.example` → `.env.local`, fill `FIREBASE_DATABASE_URL`.
2. Place the Firebase service account key at `apps/api/serviceAccountKey.json`. Never commit it.
3. From the repo root: `pnpm --filter api dev`.

## Endpoints

- `GET  /movies` — all movies
- `GET  /movies/:slug/movie` — one movie by slug
- `GET  /categories` — all categories
- `GET  /categories/:slug/movies` — movies in a category
- `POST /cart` — add item to cart
- `GET  /cart/:cartId` — read a cart
- `DELETE /cart/:cartId` — delete a cart
- `DELETE /cart/:cartId/:movieId` — remove one item
- `POST /orders` — create an order

Default port: 5001 (override with `PORT`).
