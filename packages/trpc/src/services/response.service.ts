import { answers, responses, type Db } from "@repo/db";
import type { AnswerInput } from "@repo/types";
import { TRPCError } from "@trpc/server";

export async function submitForm(
  db: Db,
  input: { slug: string; answers: AnswerInput[] },
) {
  const form = await db.query.forms.findFirst({
    where: (f, { and, eq, inArray }) =>
      and(
        eq(f.slug, input.slug),
        eq(f.status, "active"),
        inArray(f.visibility, ["public", "unlisted"]),
      ),
  });

  if (!form) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Form not found",
    });
  }

  const [response] = await db
    .insert(responses)
    .values({
      formId: form.id,
    })
    .returning();

  if (!response) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to submit your response",
    });
  }

  if (input.answers.length > 0) {
    await db.insert(answers).values(
      input.answers.map((a) => ({
        responseId: response.id,
        fieldId: a.fieldId,
        value: a.value,
      })),
    );
  }

  return {
    success: true,
    responseId: response.id,
  };
}
export async function getFormResponses(db:Db, formId: string) {

  const formFields = await db.query.fields.findMany({
    where: (f, { eq }) => eq(f.formId, formId),
    orderBy: (f, { asc }) => asc(f.order),
  });

  const formResponses = await db.query.responses.findMany({
    where: (r, { eq }) => eq(r.formId, formId),
    orderBy: (r, { desc }) => desc(r.createdAt),
  });

  const responseIds = formResponses.map((r) => r.id);

  const allAnswers =
    responseIds.length === 0
      ? []
      : await db.query.answers.findMany({
          where: (a, { inArray }) =>
            inArray(a.responseId, responseIds),
        });

  const answerMap: Record<string, any[]> = {};


  for (const ans of allAnswers) {
    if (!answerMap[ans.responseId]) {
      answerMap[ans.responseId] = [];
    }
    answerMap[ans.responseId]!.push(ans);
  }

  const finalResponses = formResponses.map((r) => ({
    ...r,
    answers: answerMap[r.id] || [],
  }));

  return {
    fields: formFields,
    responses: finalResponses,
  };
}
