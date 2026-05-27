import { z } from "zod";
import { fieldSchema } from "./field.schema.js";

export const formVisibilityEnum = z.enum([
  "draft",
  "unlisted",
  "public",
]);

export type FormvisibilityEnumType = z.infer<typeof formVisibilityEnum>;

export const createFormSchema = z.object({
  title: z.string().min(3, "Form title must be at least 3 characters."),
  description: z.string().optional(),
});

export const createFormWithFieldsSchema = z.object({
  title: z.string().min(3, "Form title must be at least 3 characters."),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "Add at least one field."),
  visibility: formVisibilityEnum.default("draft"),
});

export const updateFormSchema = z.object({
  formId: z.string(),
  title: z.string().min(3, "Form title must be at least 3 characters.").optional(),
  description: z.string().optional(),
  visibility: formVisibilityEnum.optional(),
});

export type UpdateFormSchemaType = z.infer<typeof updateFormSchema>;

export const formIdSchema = z.object({
  formId: z.string(),
});

export type CreateFormSchemaType = z.infer<typeof createFormSchema>;
