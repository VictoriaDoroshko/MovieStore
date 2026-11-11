---
name: rtk-query-pattern
description: Shape of an RTK Query endpoint with tags and cache invalidation. Load before adding or editing a *Api.ts file.
---

# RTK Query pattern

Base API in `shared/api/baseApi.ts`:

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ["Cart", "Movie", "Category", "Order"],
  endpoints: () => ({}),
});
```

Each feature injects its endpoints:

```ts
// features/cart/api/cartApi.ts
import { baseApi } from "shared/api/baseApi";
import type { Cart } from "entities/order/model/types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getCart: b.query<Cart, string>({
      query: (cartId) => `cart/${cartId}`,
      providesTags: (_r, _e, cartId) => [{ type: "Cart", id: cartId }],
    }),
    addToCart: b.mutation<Cart, { cartId: string; movieId: string }>({
      query: (body) => ({ url: "cart", method: "POST", body }),
      invalidatesTags: (_r, _e, { cartId }) => [{ type: "Cart", id: cartId }],
    }),
  }),
});

export const { useGetCartQuery, useAddToCartMutation } = cartApi;
```

## Rules

- One slice = one `*Api.ts`. Never dump endpoints into a single god-api.
- Tags are typed through `baseApi.tagTypes`. Adding a new tag → edit `baseApi.ts` first, then use it.
- `providesTags` must return the same type the matching `invalidatesTags` targets, or invalidation silently misses.
- For optimistic updates use `onQueryStarted` with `updateQueryData` and roll back in the `catch`. Pattern lives in [zod-form-pattern](zod-form-pattern.md) because checkout is the main example.
- Never catch and swallow errors in a query — let RTKQ surface them so the UI can show the right state.
