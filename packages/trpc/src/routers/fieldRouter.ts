import { router } from "../trpc.js";
import { protectedProcedure } from "../middlewares/auth.js";

import * as fieldService from "../services/field.service.js";

import {
  createManyFieldsSchema,
  updateFieldSchema,
  getFieldsSchema,
  deleteFieldSchema,
  reorderFieldsSchema,
} from "@repo/types";

export const fieldRouter = router({
  createMany: protectedProcedure
    .input(createManyFieldsSchema)
    .mutation(async ({ ctx, input }) => {
      return fieldService.createFields(
        ctx.db,
        input.formId,
        input.fields,
        ctx.user!.id,
      );
    }),

  getByFormId: protectedProcedure
    .input(getFieldsSchema)
    .query(async ({ ctx, input }) => {
      return fieldService.getFields(ctx.db, input.formId, ctx.user!.id);
    }),

  update: protectedProcedure
    .input(updateFieldSchema)
    .mutation(async ({ ctx, input }) => {
      return fieldService.updateField(ctx.db, input.fieldId, input, ctx.user!.id);
    }),

  delete: protectedProcedure
    .input(deleteFieldSchema)
    .mutation(async ({ ctx, input }) => {
      return fieldService.deleteField(ctx.db, input.fieldId, ctx.user!.id);
    }),

  reorder: protectedProcedure
    .input(reorderFieldsSchema)
    .mutation(async ({ ctx, input }) => {
      return fieldService.reorderFields(
        ctx.db,
        input.formId,
        input.orderedFieldIds,
        ctx.user!.id,
      );
    }),
});
