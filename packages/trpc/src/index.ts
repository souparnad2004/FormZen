export { createContext } from "./context.js";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./root.js";

export { appRouter, type AppRouter } from "./root.js";
export type RouterOutputs = inferRouterOutputs<AppRouter>;
