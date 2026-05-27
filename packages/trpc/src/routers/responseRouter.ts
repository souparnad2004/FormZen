import { submitFormSchema, z } from "@repo/types";
import { publicProcedure, router } from "../trpc.js";
import * as responseServices from "../services/response.service.js";
import { protectedProcedure } from "../middlewares/auth.js";

export const responseRouter = router({
  submit: publicProcedure
    .input(submitFormSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await responseServices.submitForm(ctx.db, input);

      return {
        success: true,
        data: result,
      };
    }),

  getByForm: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await responseServices.getFormResponses(
        ctx.db,
        input.formId,
      );

      return data;
    }),
});
