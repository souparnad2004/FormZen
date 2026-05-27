import { z } from "zod";

export const fieldTypeEnum = z.enum([
  "text",
  "number",
  "email",
  "textarea",
  "select",
  "radio",
]);


const baseField = z.object({
  label: z.string().min(1, "Field label is required."),
  required: z.boolean().default(false),
});


const simpleField = baseField.extend({
  type: z.enum(["text", "number", "email", "textarea"]),
  placeholder: z.string().optional(),
});

const optionField = baseField.extend({
  type: z.enum(["select", "radio"]),
  options: z
    .array(z.string().min(1, "Option labels cannot be empty."))
    .min(1, "Add at least one option for this field."),
});


export const createFieldSchema = z.discriminatedUnion("type", [
  simpleField,
  optionField,
]);
export const fieldSchema = createFieldSchema;
export type FieldInput = z.infer<typeof createFieldSchema>;


export const createManyFieldsSchema = z.object({
  formId: z.uuid(),
  fields: z.array(createFieldSchema).min(1, "Add at least one field."),
});

export const updateFieldSchema = z.object({
  fieldId: z.uuid(),

  label: z.string().min(1, "Field label is required.").optional(),
  required: z.boolean().optional(),

  type: fieldTypeEnum.optional(),

  placeholder: z.string().optional(),

  options: z.array(z.string().min(1, "Option labels cannot be empty.")).optional(),
});


export const reorderFieldsSchema = z.object({
  formId: z.uuid(),
  orderedFieldIds: z.array(z.uuid()).min(1),
});

export const getFieldsSchema = z.object({
  formId: z.uuid(),
});

export const deleteFieldSchema = z.object({
  fieldId: z.uuid(),
});

export type FieldConfig =
  | {
      options: string[];
    }
  | null;

export type CreateFieldInput = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>;
