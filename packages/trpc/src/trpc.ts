import {
  initTRPC,
  type TRPCRootObject,
  type TRPCRuntimeConfigOptions,
} from "@trpc/server";
import { ZodError } from "zod";
import type { Context } from "./context.js";

const createOpts: TRPCRuntimeConfigOptions<Context, object> = {
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause : null,
      },
    };
  },
};

export const t: TRPCRootObject<Context, object, typeof createOpts> = initTRPC
  .context<Context>()
  .create(createOpts);

export const router: typeof t.router = t.router;
export const publicProcedure: typeof t.procedure = t.procedure;
