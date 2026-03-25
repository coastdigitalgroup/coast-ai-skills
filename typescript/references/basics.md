# TypeScript Basics

## Use This Reference For

- shaping domain models
- writing safer result types
- validating external input
- choosing between unions, interfaces, and utility types

## Recommended Patterns

### Model results explicitly

```ts
type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };
```

### Brand critical identifiers

```ts
type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
```

Use branded IDs when mixing identifiers would create subtle bugs.

### Validate at the boundary

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  role: z.enum(["admin", "editor", "viewer"]),
});

type User = z.infer<typeof UserSchema>;

const parseUser = (input: unknown): User => UserSchema.parse(input);
```

Parse unknown input before it enters core logic.

### Prefer unions for state

```ts
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

This makes impossible UI states harder to represent by accident.

## Heuristics

- Start with the narrowest useful type.
- Reach for interfaces when modeling domain objects.
- Reach for type aliases when composing unions, mapped types, or branded types.
- Keep generic helpers small and purposeful.
- Delete clever type machinery if it makes maintenance harder than the bug risk it prevents.