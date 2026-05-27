import { TRPCError } from "@trpc/server";
import { publicProcedure} from "../trpc.js";


export const protectedProcedure: typeof publicProcedure = publicProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Please log in to continue" });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  },
);

export const adminProcedure: typeof publicProcedure = publicProcedure.use(
  async ({ctx, next}) => {
    if(!ctx.user) {
      throw new TRPCError({code: "UNAUTHORIZED", message: "Please log in to continue"});
    }
    if(ctx.user.role !== "admin") {
      throw new TRPCError({code: "FORBIDDEN", message: "You do not have permission to do that"})
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    })
  }
)
