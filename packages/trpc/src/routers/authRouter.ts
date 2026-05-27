import { loginSchema, registerSchema } from "@repo/types";
import { publicProcedure } from "../trpc.js";
import * as authService from "../services/auth.service.js";
import { router } from "../trpc.js";
import { protectedProcedure } from "../middlewares/auth.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authRouter = router({
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { token, user } = await authService.loginUser(ctx.db, input);

    ctx.res.cookie("jwt", token, cookieOptions);

    return user;
  }),
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { token, user } = await authService.registerUser(ctx.db, input);

      ctx.res.cookie("jwt", token, cookieOptions);

      return user;
    }),
  me: protectedProcedure.query(async ({ ctx }) => {
    return authService.me(ctx.db, ctx.user!.id);
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return {
      message: "Logged out successfully",
    };
  }),
});
