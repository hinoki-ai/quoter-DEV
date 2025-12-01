/* eslint-disable */
/**
 * Generated utilities for Convex queries, mutations, and actions.
 *
 * Usage:
 *
 * ```ts
 * import { api } from "./_generated/api";
 * const data = useQuery(api.foo.bar);
 * const result = await convex.mutation(api.foo.baz, args);
 * ```
 */
import type { ApiFromModules } from "convex/browser";
import type * as quotes from "../quotes";
import type * as lineItems from "../lineItems";

const apiModules = {
  quotes,
  lineItems,
};

type ApiModules = typeof apiModules;

export const api: ApiFromModules<ApiModules> = apiModules as any;
