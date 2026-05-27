import { protectedProcedure } from "../middlewares/auth.js";
import { publicProcedure, router } from "../trpc.js";
import * as formServices from "../services/form.service.js";
import { createFormSchema, formIdSchema, updateFormSchema, z } from "@repo/types";

export const formRouter = router({
  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await formServices.createForm(ctx.db, input, ctx.user?.id!);
    }),

  myForms: protectedProcedure.query(async ({ ctx }) => {
    return await formServices.getMyForms(ctx.db, ctx.user?.id!);
  }),

  byId: protectedProcedure
    .input(formIdSchema)
    .query(({ ctx, input }) => {
      return formServices.getFormById(ctx.db, input.formId, ctx.user?.id!);
    }),

  update: protectedProcedure
    .input(updateFormSchema)
    .mutation(({ ctx, input }) => {
      return formServices.updateForm(ctx.db, input, ctx.user?.id!);
    }),

  delete: protectedProcedure
    .input(formIdSchema)
    .mutation(({ ctx, input }) => {
      return formServices.deleteForm(ctx.db, input.formId, ctx.user?.id!);
    }),
  getPublicForm: publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ ctx, input }) => {
    return formServices.getFormWithFields(ctx.db, input.slug);
  })
});
