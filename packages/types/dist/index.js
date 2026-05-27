// src/user.schema.ts
import { z } from "zod";
var userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email("Invalid email"),
  email_verified: z.boolean()
});
var registerSchema = z.object({
  name: z.string().min(2),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
var loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
var authResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.email(),
    name: z.string(),
    email_verified: z.boolean()
  }),
  token: z.string().optional()
});

// src/index.ts
import { z as z6 } from "zod";

// src/form.schema.ts
import { z as z3 } from "zod";

// src/field.schema.ts
import { z as z2 } from "zod";
var fieldTypeEnum = z2.enum([
  "text",
  "number",
  "email",
  "textarea",
  "select",
  "radio"
]);
var baseField = z2.object({
  label: z2.string().min(1, "Field label is required."),
  required: z2.boolean().default(false)
});
var simpleField = baseField.extend({
  type: z2.enum(["text", "number", "email", "textarea"]),
  placeholder: z2.string().optional()
});
var optionField = baseField.extend({
  type: z2.enum(["select", "radio"]),
  options: z2.array(z2.string().min(1, "Option labels cannot be empty.")).min(1, "Add at least one option for this field.")
});
var createFieldSchema = z2.discriminatedUnion("type", [
  simpleField,
  optionField
]);
var fieldSchema = createFieldSchema;
var createManyFieldsSchema = z2.object({
  formId: z2.uuid(),
  fields: z2.array(createFieldSchema).min(1, "Add at least one field.")
});
var updateFieldSchema = z2.object({
  fieldId: z2.uuid(),
  label: z2.string().min(1, "Field label is required.").optional(),
  required: z2.boolean().optional(),
  type: fieldTypeEnum.optional(),
  placeholder: z2.string().optional(),
  options: z2.array(z2.string().min(1, "Option labels cannot be empty.")).optional()
});
var reorderFieldsSchema = z2.object({
  formId: z2.uuid(),
  orderedFieldIds: z2.array(z2.uuid()).min(1)
});
var getFieldsSchema = z2.object({
  formId: z2.uuid()
});
var deleteFieldSchema = z2.object({
  fieldId: z2.uuid()
});

// src/form.schema.ts
var formVisibilityEnum = z3.enum([
  "draft",
  "unlisted",
  "public"
]);
var createFormSchema = z3.object({
  title: z3.string().min(3, "Form title must be at least 3 characters."),
  description: z3.string().optional()
});
var createFormWithFieldsSchema = z3.object({
  title: z3.string().min(3, "Form title must be at least 3 characters."),
  description: z3.string().optional(),
  fields: z3.array(fieldSchema).min(1, "Add at least one field."),
  visibility: formVisibilityEnum.default("draft")
});
var updateFormSchema = z3.object({
  formId: z3.string(),
  title: z3.string().min(3, "Form title must be at least 3 characters.").optional(),
  description: z3.string().optional(),
  visibility: formVisibilityEnum.optional()
});
var formIdSchema = z3.object({
  formId: z3.string()
});

// src/answer.schema.ts
import { z as z4 } from "zod";
var answerSchema = z4.object({
  fieldId: z4.string(),
  value: z4.string()
});

// src/response.schema.ts
import { z as z5 } from "zod";
var submitFormSchema = z5.object({
  formId: z5.string(),
  slug: z5.string(),
  answers: z5.array(answerSchema).min(1)
});
export {
  answerSchema,
  authResponseSchema,
  createFieldSchema,
  createFormSchema,
  createFormWithFieldsSchema,
  createManyFieldsSchema,
  deleteFieldSchema,
  fieldTypeEnum,
  formIdSchema,
  formVisibilityEnum,
  getFieldsSchema,
  loginSchema,
  registerSchema,
  reorderFieldsSchema,
  submitFormSchema,
  updateFieldSchema,
  updateFormSchema,
  userSchema,
  z6 as z
};
//# sourceMappingURL=index.js.map