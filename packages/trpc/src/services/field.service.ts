import { and, asc, desc, eq, type Db, fields, forms } from "@repo/db";
import { TRPCError } from "@trpc/server";
import type { FieldInput, UpdateFieldInput } from "@repo/types";

type FieldType = FieldInput["type"];

function getPlaceholder(input: Partial<FieldInput>, type: FieldType) {
  if (type === "select" || type === "radio") return null;
  return "placeholder" in input ? (input.placeholder ?? null) : undefined;
}

function getConfig(input: Partial<FieldInput>, type: FieldType) {
  if (type !== "select" && type !== "radio") return null;
  return "options" in input && input.options
    ? { options: input.options }
    : undefined;
}

async function ensureFormOwner(db: Db, formId: string, userId: string) {
  const form = await db.query.forms.findFirst({
    where: (forms, { and, eq }) =>
      and(eq(forms.id, formId), eq(forms.userId, userId)),
  });

  if (!form) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
  }

  return form;
}

async function getOwnedField(db: Db, fieldId: string, userId: string) {
  const [field] = await db
    .select({ field: fields })
    .from(fields)
    .innerJoin(forms, eq(fields.formId, forms.id))
    .where(and(eq(fields.id, fieldId), eq(forms.userId, userId)))
    .limit(1);

  if (!field) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" });
  }

  return field.field;
}

export async function createFields(
  db: Db,
  formId: string,
  input: FieldInput[],
  userId: string,
) {
  if (!input.length) return [];

  await ensureFormOwner(db, formId, userId);

  const [lastField] = await db
    .select({ order: fields.order })
    .from(fields)
    .where(eq(fields.formId, formId))
    .orderBy(desc(fields.order))
    .limit(1);
  const nextOrder = (lastField?.order ?? -1) + 1;

  const formatted = input.map((field, index) => ({
    formId,
    type: field.type,
    label: field.label,
    required: field.required ?? false,
    order: nextOrder + index,
    placeholder: "placeholder" in field ? (field.placeholder ?? null) : null,
    config:
      field.type === "select" || field.type === "radio"
        ? { options: field.options }
        : null,
  }));

  const inserted = await db.insert(fields).values(formatted).returning();

  return inserted;
}

export async function getFields(db: Db, formId: string, userId: string) {
  await ensureFormOwner(db, formId, userId);

  return await db
    .select()
    .from(fields)
    .where(eq(fields.formId, formId))
    .orderBy(asc(fields.order));
}

export async function updateField(
  db: Db,
  fieldId: string,
  input: UpdateFieldInput,
  userId: string,
) {
  const existing = await getOwnedField(db, fieldId, userId);

  const nextType = (input.type ?? existing.type) as FieldType;
  const placeholder = getPlaceholder(input as FieldInput, nextType);
  const config = getConfig(input as FieldInput, nextType);

  const [updated] = await db
    .update(fields)
    .set({
      label: input.label,
      required: input.required,
      type: input.type,
      placeholder,
      config,
    })
    .where(eq(fields.id, fieldId))
    .returning();

  if (!updated) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Unable to save the field" });
  }

  return updated;
}

export async function deleteField(db: Db, fieldId: string, userId: string) {
  await getOwnedField(db, fieldId, userId);

  const [deleted] = await db
    .delete(fields)
    .where(eq(fields.id, fieldId))
    .returning();

  if (!deleted) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Unable to delete the field" });
  }

  return deleted;
}

export async function reorderFields(
  db: Db,
  formId: string,
  orderedFieldIds: string[],
  userId: string,
) {
  if (!orderedFieldIds.length) return { success: true };

  await ensureFormOwner(db, formId, userId);

  const updates = orderedFieldIds.map((id, index) =>
    db
      .update(fields)
      .set({ order: index })
      .where(and(eq(fields.id, id), eq(fields.formId, formId))),
  );

  await Promise.all(updates);

  return { success: true };
}
