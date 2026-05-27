import { forms, type Db } from "@repo/db";
import type { CreateFormSchemaType, UpdateFormSchemaType } from "@repo/types";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { and, eq } from "@repo/db";

export async function createForm(
  db: Db,
  input: CreateFormSchemaType,
  userId: string,
) {
  const slug =
    input.title.toLowerCase().replace(/\s+/g, "-") +
    "-" +
    crypto.randomUUID().slice(0, 6);

  const result = await db
    .insert(forms)
    .values({
      slug,
      title: input.title,
      userId,
      description: input.description,
      visibility: "draft",
      status: "active",
    })
    .returning();

  const [form] = result;
  if (!form) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unable to create the form",
    });
  }

  return form;
}

export async function getMyForms(db: Db, userId: string) {
  return db.query.forms.findMany({
    where: (forms, { eq }) => eq(forms.userId, userId),
    orderBy: (forms, { desc }) => [desc(forms.createdAt)],
  });
}

export async function getFormById(db: Db, formId: string, userId: string) {
  const form = await db.query.forms.findFirst({
    where: (forms, { eq }) => eq(forms.id, formId),
  });

  if (!form || form.userId !== userId) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Form not found",
    });
  }

  return form;
}

export async function updateForm(
  db: Db,
  input: UpdateFormSchemaType,
  userId: string,
) {
  const form = await getFormById(db, input.formId, userId);

  const updated = await db
    .update(forms)
    .set({
      title: input.title ?? form.title,
      description: input.description ?? form.description,
      visibility: input.visibility ?? form.visibility,
    })
    .where(and(eq(forms.id, input.formId), eq(forms.userId, userId)))
    .returning();

  const [updatedForm] = updated;
  if (!updatedForm) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Unable to save the form" });
  }

  return updatedForm;
}

export async function deleteForm(
  db: Db,
  formId: string,
  userId: string,
) {
  const form = await getFormById(db, formId, userId);

  if(!form) throw new TRPCError({code: "NOT_FOUND", message: "Form not found"})

  const updated = await db.delete(forms).where(and(eq(forms.id, formId), eq(forms.userId, userId)))
  return updated;
}


export async function getFormWithFields(db: Db, slug: string) {
  const form = await db.query.forms.findFirst({
    where: (forms, { and, eq, inArray }) =>
      and(
        eq(forms.slug, slug),
        eq(forms.status, "active"),
        inArray(forms.visibility, ["public", "unlisted"]),
      ),
  });

  if (!form) return null;

  const fields = await db.query.fields.findMany({
    where: (fields, { eq }) => eq(fields.formId, form.id),
    orderBy: (fields, { asc }) => asc(fields.order),
  });

  return {
    ...form,
    fields,
  };
}
