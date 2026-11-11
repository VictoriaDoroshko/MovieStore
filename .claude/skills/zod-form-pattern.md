---
name: zod-form-pattern
description: React Hook Form + Zod + optimistic mutation with rollback. Load before building a form that submits to RTK Query.
---

# Zod + RHF + optimistic rollback

One schema, two uses: Zod validator AND TS type via `z.infer`.

```ts
// features/checkout/model/checkoutSchema.ts
import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().regex(/^[A-Za-z]+$/, "Latin letters only"),
  lastName: z.string().regex(/^[A-Za-z]+$/),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/),
  email: z.string().email(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
```

Form uses `zodResolver`:

```ts
// features/checkout/ui/CheckoutForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutValues } from "../model/checkoutSchema";
import { useCreateOrderMutation } from "../api/checkoutApi";

export const CheckoutForm = () => {
  const form = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema), mode: "onChange" });
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const onSubmit = form.handleSubmit(async (values) => {
    await createOrder(values).unwrap(); // RTKQ throws on failure
  });

  return <form onSubmit={onSubmit}>…</form>;
};
```

## Optimistic mutation with rollback

Inside the endpoint definition:

```ts
clearCart: b.mutation<void, string>({
  query: (cartId) => ({ url: `cart/${cartId}`, method: "DELETE" }),
  async onQueryStarted(cartId, { dispatch, queryFulfilled }) {
    const patch = dispatch(
      cartApi.util.updateQueryData("getCart", cartId, (draft) => {
        draft.items = [];
        draft.totalAmount = 0;
      })
    );
    try { await queryFulfilled; } catch { patch.undo(); }
  },
}),
```

Rule: optimistic update the cache immediately, roll back only when the server rejects. The UI stays responsive on the happy path and never shows a wrong-but-persistent state on the sad path.
